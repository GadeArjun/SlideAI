import fs from "fs/promises";
import path from "path";

import llmJson from "../../config/llm.js";
import { emitToUser } from "../../config/socket.js";

const PROMPT_PATH = path.join(
  process.cwd(),
  "agents",
  "intent_parser",
  "prompt.txt"
);

const DEFAULT_THEME = {
  backgroundColor: "#000000",
  surfaceColor: "#171717",
  primaryTextColor: "#FFFFFF",
  secondaryTextColor: "#A3A3A3",
  accentColor: "#F59E0B",
  fontFamily: "Calibri",
};

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

function validateSlides(slides = []) {
  if (!Array.isArray(slides)) return [];

  return slides.map((slide, index) => ({
    id: slide?.id || `slide_${index + 1}`,

    category: ["hero", "content", "closing"].includes(slide?.category)
      ? slide.category
      : "content",

    title:
      typeof slide?.title === "string" ? slide.title : `Slide ${index + 1}`,

    templateDirection: slide?.templateDirection || "paragraph",

    description: slide?.description || "",

    keyPoints: Array.isArray(slide?.keyPoints)
      ? slide.keyPoints.slice(0, 5)
      : [],
  }));
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

function validatePresentation(presentation = {}) {
  return {
    title: presentation?.title || "Untitled Presentation",

    topic: presentation?.topic || "",

    goal: presentation?.goal || "",

    audience: presentation?.audience || "",

    tone: presentation?.tone || "professional",

    totalSlides: Number(presentation?.totalSlides) || 1,
  };
}

function validateIntent(data = {}) {
  return {
    presentation: validatePresentation(data.presentation),

    theme: validateTheme(data.theme),

    slides: validateSlides(data.slides),
  };
}

export async function parsePresentationIntent(userPrompt = "", userId = null) {
  try {
    if (!userPrompt || typeof userPrompt !== "string") {
      if (userId) {
        emitToUser(userId, "agent:intent:failed", {
          success: false,
          message: "User prompt is required",
        });
      }
      return {
        success: false,
        error: "User prompt is required",
      };
    }

    const systemPrompt = await fs.readFile(PROMPT_PATH, "utf-8");

    if (userId) {
      emitToUser(userId, "agent:intent:start", {
        success: true,
        message: "Intent Parser Start.",
      });
    }

    const response = await llmJson({
      systemPrompt,

      userPrompt,

      temperature: 0.4,

      maxTokens: 4000,

      reasoningEffort: "medium",

      metadata: {
        agent: "intent-parser",
      },
    });

    if (!response.success) {
      if (userId) {
        emitToUser(userId, "agent:intent:failed", {
          success: false,
          message: response.error || "Failed to generate intent.",
        });
      }

      return {
        success: false,
        error: response.error || "Failed to generate intent",
      };
    }

    let parsedData = response.data;

    if (typeof parsedData === "string") {
      const parsed = safeJsonParse(parsedData);

      if (!parsed.success) {
        if (userId) {
          emitToUser(userId, "agent:intent:failed", {
            success: false,
            message: "Failed to generate intent.",
          });
        }

        return {
          success: false,
          error: "Invalid JSON response",
          raw: parsedData,
        };
      }

      parsedData = parsed.data;
    }

    const validatedIntent = validateIntent(parsedData);

    if (!validatedIntent.slides || validatedIntent.slides.length === 0) {
      if (userId) {
        emitToUser(userId, "agent:intent:failed", {
          success: false,
          message: "Failed to generate intent.",
        });
      }
      return {
        success: false,
        error: "No slides generated",
      };
    }

    validatedIntent.presentation.totalSlides = validatedIntent.slides.length;

    if (userId) {
      emitToUser(userId, "agent:intent:end", {
        success: true,
        message: "Intent completed successfuly",
      });
    }

    return {
      success: true,

      data: validatedIntent,
    };
  } catch (error) {
    console.error("[Intent Parser Error]", error);

    if (userId) {
      emitToUser(userId, "agent:intent:failed", {
        success: false,
        message: "Failed to generate intent ",
      });
    }

    return {
      success: false,

      error: error?.message || "Failed to parse presentation intent",
    };
  }
}

export default parsePresentationIntent;
