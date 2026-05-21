import fs from "fs/promises";
import path from "path";

import llmJson from "../../config/llm.js";

import {
  getProjectById,
  updateSlide,
  addProjectLog,
} from "../../services/project.service.js";

import { emitToUser } from "../../config/socket.js";

const PROMPT_PATH = path.join(
  process.cwd(),
  "agents",
  "per_slide_editor",
  "prompt.txt"
);

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

export async function editPresentationAgent(
  projectId,
  slideNumber,
  userPrompt,
  userId
) {
  try {
    /**
     * -----------------------------------
     * GET PROJECT
     * -----------------------------------
     */
    const projectResult = await getProjectById(projectId, userId);

    if (!projectResult?.success) {
      throw new Error(projectResult?.error || "Project not found");
    }

    const project = projectResult?.data || projectResult;

    /**
     * -----------------------------------
     * FIND SLIDE
     * -----------------------------------
     */
    const slide = project?.slides?.[slideNumber - 1];
    const intentSlides = project?.intentParser?.parsedData?.slides || [];

    const presentationOutline = intentSlides.map((slide, index) => ({
      slide: index + 1,

      title: slide?.title || "",

      category: slide?.category || "content",

      direction: slide?.templateDirection || "",

      template: slide?.template || "",

      isCurrentSlide: index + 1 === slideNumber,
    }));

    if (!slide) {
      throw new Error(`Slide ${slideNumber} not found`);
    }

    /**
     * -----------------------------------
     * UPDATE STATUS => EDITING
     * -----------------------------------
     */
    await updateSlide({
      projectId,
      userId,
      slideId: slide?.slideId || slide?.id || `slide_${slideNumber}`,

      updates: {
        status: "slide_editing",
        error: "",
      },
    });

    /**
     * -----------------------------------
     * SOCKET START EVENT
     * -----------------------------------
     */
    if (userId) {
      emitToUser(userId, "agent:per_slide_edit:start", {
        success: true,

        projectId,

        slideNumber,

        message: "Starting slide edit...",
      });
    }

    /**
     * -----------------------------------
     * LOG
     * -----------------------------------
     */
    await addProjectLog({
      projectId,
      userId,

      step: "slide_edit_started",

      message: `Editing slide ${slideNumber}`,
    });

    /**
     * -----------------------------------
     * READ SYSTEM PROMPT
     * -----------------------------------
     */
    const systemPrompt = await fs.readFile(PROMPT_PATH, "utf-8");

    /**
     * -----------------------------------
     * LLM REQUEST
     * -----------------------------------
     *
     * IMPORTANT:
     * ONLY SEND:
     * - userPrompt
     * - existing slide.data
     *
     * DO NOT SEND FULL PROJECT
     * DO NOT SEND ALL SLIDES
     *
     * Keeps token usage small
     * and editing accurate.
     */
    const llmUserPrompt = JSON.stringify(
      {
        instruction: userPrompt,

        slide: {
          title: slide?.title,

          template: slide?.template,

          category: slide?.category,

          data: slide?.data || {},
        },

        outline: presentationOutline,
      },
      null,
      2
    );

    const response = await llmJson({
      systemPrompt,

      userPrompt: llmUserPrompt,

      temperature: 0.4,

      maxTokens: 3000,

      reasoningEffort: "low",

      metadata: {
        agent: "per-slide-editor",

        projectId,

        slideNumber,
      },
    });

    /**
     * -----------------------------------
     * LLM FAILED
     * -----------------------------------
     */
    if (!response?.success) {
      throw new Error(response?.error || "Slide editing failed");
    }

    /**
     * -----------------------------------
     * PARSE RESPONSE
     * -----------------------------------
     */
    let parsedData = response?.data;

    if (typeof parsedData === "string") {
      const parsed = safeJsonParse(parsedData);

      if (!parsed?.success) {
        throw new Error("Invalid JSON response");
      }

      parsedData = parsed?.data;
    }

    /**
     * -----------------------------------
     * VALIDATE DATA
     * -----------------------------------
     */
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("Invalid edited slide data");
    }

    /**
     * -----------------------------------
     * ONLY REPLACE SLIDE.DATA
     * -----------------------------------
     *
     * Keep:
     * - template
     * - category
     * - title
     * - metadata
     *
     * unless explicitly returned.
     */

    const updatedSlide = {
      ...slide,

      ...parsedData,

      status: "completed",

      error: "",
    };

    /**
     * -----------------------------------
     * SAVE TO DB
     * -----------------------------------
     */
    await updateSlide({
      projectId,
      userId,

      slideId: slide?.slideId || slide?.id || `slide_${slideNumber}`,

      updates: updatedSlide,
    });

    /**
     * -----------------------------------
     * LOG SUCCESS
     * -----------------------------------
     */
    await addProjectLog({
      projectId,
      userId,

      step: "slide_edit_completed",

      message: `Slide ${slideNumber} edited successfully`,
    });

    /**
     * -----------------------------------
     * SOCKET SUCCESS
     * -----------------------------------
     */
    if (userId) {
      emitToUser(userId, "agent:per_slide_edit:end", {
        success: true,

        projectId,

        slideNumber,

        updatedSlide,

        message: "Slide edited successfully.",
      });
    }

    /**
     * -----------------------------------
     * RETURN
     * -----------------------------------
     */
    return {
      success: true,

      data: updatedSlide,
    };
  } catch (error) {
    console.error("[Per Slide Edit Error]", error);

    /**
     * -----------------------------------
     * SOCKET FAILED
     * -----------------------------------
     */
    if (userId) {
      emitToUser(userId, "agent:per_slide_edit:failed", {
        success: false,

        projectId,

        slideNumber,

        error: error?.message || "Slide edit failed",

        message: "Failed to edit slide.",
      });
    }

    /**
     * -----------------------------------
     * UPDATE FAILED STATUS
     * -----------------------------------
     */
    try {
      await updateSlide({
        projectId,
        userId,

        slideId: `slide_${slideNumber}`,

        updates: {
          status: "failed",

          error: error?.message || "Slide edit failed",
        },
      });
    } catch (e) {
      console.error("[Edit Slide Fail Save Error]", e);
    }

    /**
     * -----------------------------------
     * LOG FAILED
     * -----------------------------------
     */
    try {
      await addProjectLog({
        projectId,
        userId,

        step: "slide_edit_failed",

        message: `Slide ${slideNumber} edit failed`,
      });
    } catch {}

    return {
      success: false,

      error: error?.message || "Slide edit failed",
    };
  }
}
