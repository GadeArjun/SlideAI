import { emitToUser } from "../config/socket.js";
import {
  startPresentationPipeline,
  pausePipeline,
  resumePipeline,
  getPipelineState,
  editPresentation,
} from "../pipeline/presentation.pipeline.js";

import {
  getProjectById,
  getAllProjects,
  deleteProject,
} from "../services/project.service.js";

/**
 * CREATE PROJECT + START PIPELINE
 */
export async function createPresentationController(req, res) {
  try {
    const userId = req.user?.id || req.body?.userId;

    const { prompt, title } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    const result = await startPresentationPipeline({
      userId,

      userPrompt: prompt,

      title: title || ".........",
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(201).json({
      success: true,

      message: "Presentation pipeline started",

      data: result.data,
    });
  } catch (error) {
    console.error("[Controller] createPresentationController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to create presentation",
    });
  }
}

/**
 * GET SINGLE PROJECT
 */
export async function getProjectController(req, res) {
  try {
    const userId = req.user?.id || req.query?.userId;

    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await getProjectById(projectId, userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,

      data: result.data,
    });
  } catch (error) {
    console.error("[Controller] getProjectController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to fetch project",
    });
  }
}

/**
 * GET ALL PROJECTS
 */
export async function getAllProjectsController(req, res) {
  try {
    const userId = req.user?.id || req.query?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await getAllProjects(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,

      data: result.data,
    });
  } catch (error) {
    console.error("[Controller] getAllProjectsController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to fetch projects",
    });
  }
}

/**
 * DELETE PROJECT
 */
export async function deleteProjectController(req, res) {
  try {
    const userId = req.user?.id || req.body?.userId;

    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await deleteProject(projectId, userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("[Controller] deleteProjectController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to delete project",
    });
  }
}

/**
 * PAUSE PIPELINE
 */
export async function pausePipelineController(req, res) {
  try {
    const { projectId } = req.params;

    const result = await pausePipeline(projectId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Pipeline paused",
    });
  } catch (error) {
    console.error("[Controller] pausePipelineController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to pause pipeline",
    });
  }
}

/**
 * RESUME PIPELINE
 */
export async function resumePipelineController(req, res) {
  try {
    const userId = req.user?.id || req.body?.userId;

    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await resumePipeline({
      projectId,
      userId,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Pipeline resumed",
    });
  } catch (error) {
    console.error("[Controller] resumePipelineController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to resume pipeline",
    });
  }
}

/**
 * GET PIPELINE STATE
 */
export async function getPipelineStateController(req, res) {
  try {
    const { projectId } = req.params;

    const state = getPipelineState(projectId);

    return res.status(200).json({
      success: true,

      data: {
        active: !!state,

        paused: state?.paused || false,
      },
    });
  } catch (error) {
    console.error("[Controller] getPipelineStateController", error);

    return res.status(500).json({
      success: false,

      error: error?.message || "Failed to get pipeline state",
    });
  }
}

/**
 * EDIT SLIDE
 */

export async function editPresentationController(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const { slideNumber, userPrompt } = req.body;

    let projectId = req.body.projectId || req.params.projectId;

    editPresentation(projectId, slideNumber, userPrompt, userId);

    res.json({ success: true, message: "Slide eddting start" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Falied to update slide",
    });
  }
}

export default {
  createPresentationController,

  getProjectController,

  getAllProjectsController,

  deleteProjectController,

  pausePipelineController,

  resumePipelineController,

  getPipelineStateController,

  editPresentationController,
};
