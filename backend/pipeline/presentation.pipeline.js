import {
  createProject,
  getProjectById,
  updateProjectStatus,
  updateIntentParserStatus,
  saveIntentParserResult,
  replaceProjectSlides,
  addProjectLog,
} from "../services/project.service.js";

import parsePresentationIntent from "../agents/intent_parser/agent.js";

import generateSlidesContent from "../agents/per_slide_content/agent.js";

/**
 * IN-MEMORY PIPELINE CONTROL
 * replace with redis/db queue later
 */
const activePipelines = new Map();

/**
 * START FULL PIPELINE
 */
export async function startPresentationPipeline({ userId, userPrompt, title }) {
  try {
    /**
     * CREATE PROJECT
     */
    const createdProject = await createProject({
      userId,
      userPrompt,
      title,
    });

    if (!createdProject.success) {
      throw new Error(createdProject.error);
    }

    const project = createdProject.data;

    /**
     * START BACKGROUND PIPELINE
     */
    processPipeline({
      projectId: project._id.toString(),

      userId,
    });

    return {
      success: true,

      data: {
        projectId: project._id,

        status: "intent_processing",
      },
    };
  } catch (error) {
    console.error("[Pipeline] startPresentationPipeline", error);

    return {
      success: false,

      error: error?.message || "Failed to start pipeline",
    };
  }
}

/**
 * MAIN PROCESSOR
 */
export async function processPipeline({ projectId, userId }) {
  try {
    /**
     * MARK ACTIVE
     */
    activePipelines.set(projectId, {
      paused: false,
    });

    /**
     * GET PROJECT
     */
    const projectResult = await getProjectById(projectId, userId);

    if (!projectResult.success) {
      throw new Error(projectResult.error);
    }

    const project = projectResult.data;

    /**
     * CHECK PAUSE
     */
    if (isPipelinePaused(projectId)) {
      return;
    }

    /**
     * UPDATE STATUS
     */
    await updateProjectStatus({
      projectId,
      userId,
      status: "intent_processing",
    });

    await updateIntentParserStatus({
      projectId,
      userId,
      status: "processing",
    });

    await addProjectLog({
      projectId,
      userId,
      step: "intent_parser",
      message: "Intent parser started",
    });

    /**
     * INTENT PARSER
     */
    const intentResult = await parsePresentationIntent(
      project.userPrompt,
      userId
    );

    if (!intentResult.success) {
      await updateProjectStatus({
        projectId,
        userId,
        status: "failed",
      });

      await updateIntentParserStatus({
        projectId,
        userId,
        status: "failed",
        error: intentResult.error,
      });

      throw new Error(intentResult.error);
    }

    /**
     * SAVE INTENT RESULT
     */
    await saveIntentParserResult({
      projectId,
      userId,

      prompt: project.userPrompt,

      parsedData: intentResult.data,

      theme: intentResult.data.theme,
    });

    await addProjectLog({
      projectId,
      userId,
      step: "intent_parser",
      message: "Intent parser completed",
    });

    /**
     * CHECK PAUSE
     */
    if (isPipelinePaused(projectId)) {
      return;
    }

    /**
     * UPDATE STATUS
     */
    await updateProjectStatus({
      projectId,
      userId,
      status: "slides_generating",
    });

    await addProjectLog({
      projectId,
      userId,
      step: "slide_generation",
      message: "Per slide generation started",
    });

    /**
     * GENERATE SLIDES
     */
    const slidesResult = await generateSlidesContent({
      intentData: intentResult.data,
      existingSlides: projectResult.slides || [],
      userId,
      projectId
    });

    if (!slidesResult.success) {
      await updateProjectStatus({
        projectId,
        userId,
        status: "failed",
      });

      throw new Error(slidesResult.error);
    }

    /**
     * STORE GENERATED SLIDES
     */
    await replaceProjectSlides({
      projectId,
      userId,

      slides: slidesResult.data.slides,
    });

    await addProjectLog({
      projectId,
      userId,
      step: "slide_generation",
      message: "Slides generated successfully",
    });

    /**
     * FINAL STATUS
     */
    await updateProjectStatus({
      projectId,
      userId,
      status: "completed",
    });

    await addProjectLog({
      projectId,
      userId,
      step: "pipeline",
      message: "Pipeline completed",
    });

    /**
     * REMOVE ACTIVE
     */
    activePipelines.delete(projectId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Pipeline] processPipeline", error);

    try {
      await updateProjectStatus({
        projectId,
        userId,
        status: "failed",
      });

      await addProjectLog({
        projectId,
        userId,
        step: "pipeline_error",
        message: error?.message || "Pipeline failed",
      });
    } catch (e) {
      console.error("[Pipeline] error update failed", e);
    }

    activePipelines.delete(projectId);

    return {
      success: false,

      error: error?.message || "Pipeline failed",
    };
  }
}

/**
 * PAUSE PIPELINE
 */
export async function pausePipeline(projectId) {
  try {
    const existing = activePipelines.get(projectId);

    if (!existing) {
      return {
        success: false,
        error: "Pipeline not active",
      };
    }

    existing.paused = true;

    activePipelines.set(projectId, existing);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Failed to pause pipeline",
    };
  }
}

/**
 * RESUME PIPELINE
 */
export async function resumePipeline({ projectId, userId }) {
  try {
    const existing = activePipelines.get(projectId);

    if (existing) {
      existing.paused = false;

      activePipelines.set(projectId, existing);
    }

    processPipeline({
      projectId,
      userId,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Failed to resume pipeline",
    };
  }
}

/**
 * CHECK PAUSE STATE
 */
export function isPipelinePaused(projectId) {
  const state = activePipelines.get(projectId);

  return state?.paused === true;
}

/**
 * GET PIPELINE STATE
 */
export function getPipelineState(projectId) {
  return activePipelines.get(projectId) || null;
}

export default {
  startPresentationPipeline,

  processPipeline,

  pausePipeline,

  resumePipeline,

  getPipelineState,
};
