import fs from "fs/promises";
import path from "path";

import llmJson from "../../config/llm.js";
import { addProjectLog, updateSlide } from "../../services/project.service.js";
import { emitToUser } from "../../config/socket.js";

const PROMPT_PATH = path.join(
  process.cwd(),
  "agents",
  "per_slide_content",
  "prompt.txt"
);

const MAX_PARALLEL_SLIDES = Number(
  process.env.SLIDE_CONTENT_PARALLEL_LIMIT || 10
);

const DEFAULT_THEME = {
  backgroundColor: "#000000",
  surfaceColor: "#171717",
  primaryTextColor: "#FFFFFF",
  secondaryTextColor: "#A3A3A3",
  accentColor: "#F59E0B",
  fontFamily: "Calibri",
};

function chunkArray(array = [], size = 1) {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

function safeJsonParse(value) {
  try {
    return {
      success: true,
      data: JSON.parse(value),
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

function validateTheme(theme = {}) {
  return {
    backgroundColor: theme?.backgroundColor || DEFAULT_THEME.backgroundColor,

    surfaceColor: theme?.surfaceColor || DEFAULT_THEME.surfaceColor,

    primaryTextColor: theme?.primaryTextColor || DEFAULT_THEME.primaryTextColor,

    secondaryTextColor:
      theme?.secondaryTextColor || DEFAULT_THEME.secondaryTextColor,

    accentColor: theme?.accentColor || DEFAULT_THEME.accentColor,

    fontFamily: theme?.fontFamily || DEFAULT_THEME.fontFamily,
  };
}

function validateSlide(slide = {}, index = 0) {
  return {
    id: slide?.id || `slide_${index + 1}`,

    category: slide?.category || "content",

    title: slide?.title || `Slide ${index + 1}`,

    templateDirection: slide?.templateDirection || "paragraph",

    description: slide?.description || "",

    keyPoints: Array.isArray(slide?.keyPoints) ? slide.keyPoints : [],
  };
}

function validateIntent(intent = {}) {
  return {
    presentation: {
      title: intent?.presentation?.title || "Untitled Presentation",

      topic: intent?.presentation?.topic || "",

      goal: intent?.presentation?.goal || "",

      audience: intent?.presentation?.audience || "",

      tone: intent?.presentation?.tone || "professional",

      totalSlides: intent?.presentation?.totalSlides || 1,
    },

    theme: validateTheme(intent?.theme),

    slides: Array.isArray(intent?.slides)
      ? intent.slides.map(validateSlide)
      : [],
  };
}

function validateGeneratedSlide(slide = {}, fallbackSlide = {}) {
  return {
    id: slide?.id || fallbackSlide?.id,

    slideId: slide?.slideId || fallbackSlide?.id,

    category: slide?.category || fallbackSlide?.category || "content",

    title: slide?.title || fallbackSlide?.title || "",

    template: slide?.template || "content_title_paragraph",

    templateDirection:
      slide?.templateDirection ||
      fallbackSlide?.templateDirection ||
      "paragraph",

    description: slide?.description || fallbackSlide?.description || "",

    data: typeof slide?.data === "object" ? slide.data : {},

    status: "completed",

    error: "",
  };
}

function isSlideAlreadyGenerated(existingSlides = [], slideId) {
  if (!Array.isArray(existingSlides)) {
    return false;
  }

  return existingSlides.some(
    (slide) =>
      slide?.slideId === slideId &&
      slide?.status === "completed" &&
      slide?.template &&
      slide?.data &&
      Object.keys(slide.data || {}).length > 0
  );
}

function getExistingSlide(existingSlides = [], slideId) {
  return existingSlides.find((slide) => slide?.slideId === slideId);
}

async function generateSingleSlide({
  systemPrompt,
  presentation,
  theme,
  slide,
}) {
  try {
    const userPrompt = JSON.stringify(
      {
        presentation,
        theme,
        slide,
      },
      null,
      2
    );

    const response = await llmJson({
      systemPrompt,

      userPrompt,

      temperature: 0.5,

      maxTokens: 3000,

      reasoningEffort: "medium",

      metadata: {
        agent: "per-slide-content",

        slideId: slide.id,
      },
    });

    if (!response.success) {
      return {
        success: false,

        slideId: slide.id,

        error: response.error || "Failed to generate slide",
      };
    }

    let parsedData = response.data;

    if (typeof parsedData === "string") {
      const parsed = safeJsonParse(parsedData);

      if (!parsed.success) {
        return {
          success: false,

          slideId: slide.id,

          error: "Invalid JSON response",
        };
      }

      parsedData = parsed.data;
    }

    const generatedSlide = Array.isArray(parsedData)
      ? parsedData[0]
      : parsedData;

    if (!generatedSlide || typeof generatedSlide !== "object") {
      return {
        success: false,

        slideId: slide.id,

        error: "Invalid slide response structure",
      };
    }

    const validatedSlide = validateGeneratedSlide(generatedSlide, slide);

    return {
      success: true,

      slideId: slide.id,

      data: validatedSlide,
    };
  } catch (error) {
    console.error("[Slide Generation Error]", slide?.id, error);

    return {
      success: false,

      slideId: slide?.id,

      error: error?.message || "Failed to generate slide",
    };
  }
}

export async function generateSlidesContent({
  intentData = {},

  existingSlides = [],

  projectId,

  userId,
}) {
  try {
    const validatedIntent = validateIntent(intentData);
    /**
     * AGENT START
     */
    if (userId) {
      emitToUser(userId, "agent:per_slide_content:start", {
        success: true,

        message: "Slide content generation started.",

        totalSlides: validatedIntent.slides.length,

        projectId,
      });
    }

    if (!validatedIntent?.slides || validatedIntent.slides.length === 0) {
      return {
        success: false,

        error: "No slides found in intent",
      };
    }

    const systemPrompt = await fs.readFile(PROMPT_PATH, "utf-8");

    /**
     * FINAL RESULT
     */
    const finalSlides = [];

    /**
     * SKIPPED
     */
    const skippedSlides = [];

    /**
     * TO GENERATE
     */
    const pendingSlides = [];

    /**
     * CHECK EXISTING
     */
    for (const slide of validatedIntent.slides) {
      const alreadyGenerated = isSlideAlreadyGenerated(
        existingSlides,
        slide.id
      );

      if (alreadyGenerated) {
        const existingSlide = getExistingSlide(existingSlides, slide.id);

        finalSlides.push(existingSlide);

        skippedSlides.push({
          slideId: slide.id,
          reason: "Already generated",
        });
      } else {
        pendingSlides.push(slide);
      }
    }

    /**
     * NOTHING TO GENERATE
     */
    if (pendingSlides.length === 0) {
      finalSlides.sort((a, b) => {
        const aNum = Number(String(a.slideId || a.id).replace("slide_", ""));

        const bNum = Number(String(b.slideId || b.id).replace("slide_", ""));

        return aNum - bNum;
      });

      return {
        success: true,

        data: {
          presentation: validatedIntent.presentation,

          theme: validatedIntent.theme,

          slides: finalSlides,
        },

        stats: {
          total: validatedIntent.slides.length,

          generated: 0,

          skipped: skippedSlides.length,

          failed: 0,

          parallelLimit: MAX_PARALLEL_SLIDES,
        },

        skippedSlides,

        failedSlides: [],
      };
    }

    /**
     * PARALLEL CHUNKS
     */
    const slideChunks = chunkArray(pendingSlides, MAX_PARALLEL_SLIDES);

    const failedSlides = [];

    /**
     * PROCESS CHUNKS
     */
    for (const chunk of slideChunks) {
      const results = await Promise.allSettled(
        chunk.map((slide) =>
          generateSingleSlide({
            systemPrompt,

            presentation: validatedIntent.presentation,

            theme: validatedIntent.theme,

            slide,
          })
        )
      );
      /**
       * HANDLE RESULTS
       */
      /**
       * HANDLE RESULTS
       */
      for (const result of results) {
        /**
         * SUCCESS
         */
        if (result.status === "fulfilled" && result.value?.success) {
          const generatedSlide = result.value.data;

          /**
           * PUSH LOCAL
           */
          finalSlides.push(generatedSlide);

          /**
           * SOCKET SUCCESS EVENT
           */
          if (userId) {
            emitToUser(userId, "agent:per_slide_content:progress", {
              success: true,

              message: `${generatedSlide.title} generated successfully.`,

              slideId: generatedSlide.slideId,

              title: generatedSlide.title,

              status: "completed",

              projectId,
            });
          }

          /**
           * SAVE IMMEDIATELY TO DB
           */
          await updateSlide({
            projectId,

            userId,

            slideId: generatedSlide.slideId,

            updates: {
              ...generatedSlide,

              status: "completed",

              error: "",
            },
          });

          /**
           * LOG
           */
          await addProjectLog({
            projectId,

            userId,

            step: "slide_completed",

            message: `${generatedSlide.slideId} generated`,
          });
        } else {
          /**
           * FAILED
           */
          const errorData = result?.value || {};

          const failedSlideId = errorData?.slideId || "unknown";

          const failedError = errorData?.error || "Generation failed";

          /**
           * STORE FAILED
           */
          failedSlides.push({
            slideId: failedSlideId,

            error: failedError,
          });

          /**
           * SOCKET FAILED EVENT
           */
          if (userId) {
            emitToUser(userId, "agent:per_slide_content:failed", {
              success: false,

              message: `${failedSlideId} generation failed.`,

              slideId: failedSlideId,

              error: failedError,

              status: "failed",

              projectId,
            });
          }

          /**
           * SAVE FAILED STATUS
           */
          await updateSlide({
            projectId,

            userId,

            slideId: failedSlideId,

            updates: {
              status: "failed",

              error: failedError,
            },
          });

          /**
           * LOG
           */
          await addProjectLog({
            projectId,

            userId,

            step: "slide_failed",

            message: `${failedSlideId} failed`,
          });
        }
      }
    }

    /**
     * SORT
     */
    finalSlides.sort((a, b) => {
      const aNum = Number(String(a.slideId || a.id).replace("slide_", ""));

      const bNum = Number(String(b.slideId || b.id).replace("slide_", ""));

      return aNum - bNum;
    });

    /**
     * AGENT END
     */
    if (userId) {
      emitToUser(userId, "agent:per_slide_content:end", {
        success: true,

        message: "All slide contents generated successfully.",

        totalSlides: validatedIntent.slides.length,

        generated: pendingSlides.length - failedSlides.length,

        failed: failedSlides.length,

        skipped: skippedSlides.length,

        projectId,
      });
    }

    return {
      success: true,

      data: {
        presentation: validatedIntent.presentation,

        theme: validatedIntent.theme,

        slides: finalSlides,
      },

      stats: {
        total: validatedIntent.slides.length,

        generated: pendingSlides.length - failedSlides.length,

        skipped: skippedSlides.length,

        failed: failedSlides.length,

        parallelLimit: MAX_PARALLEL_SLIDES,
      },

      skippedSlides,

      failedSlides,
    };
  } catch (error) {
    console.error("[Per Slide Content Agent Error]", error);

    if (userId) {
      emitToUser(userId, "agent:per_slide_content:failed", {
        success: false,

        message: "Slide content generation failed.",

        error: error?.message,

        projectId,
      });
    }

    return {
      success: false,

      error: error?.message || "Failed to generate slide contents",
    };
  }
}

export default generateSlidesContent;
