import mongoose from "mongoose";

import Project from "../models/Project.model.js";

/**
 * CREATE PROJECT
 */
export async function createProject({
  userId,
  userPrompt,
  title = "Untitled Presentation",
}) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!userPrompt) {
      throw new Error("userPrompt is required");
    }

    const project = await Project.create({
      userId,

      title,

      userPrompt,

      status: "draft",

      intentParser: {
        status: "pending",
      },
    });

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] createProject", error);

    return {
      success: false,
      error: error?.message || "Failed to create project",
    };
  }
}

/**
 * GET PROJECT BY ID
 */
export async function getProjectById(projectId, userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid project id");
    }

    const project = await Project.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] getProjectById", error);

    return {
      success: false,
      error: error?.message || "Failed to get project",
    };
  }
}

/**
 * GET ALL PROJECTS
 */
export async function getAllProjects(userId) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const projects = await Project.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .select(
        "_id title status createdAt updatedAt slides intentParser.parsedData.presentation.title"
      );

    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    console.error("[Project Service] getAllProjects", error);

    return {
      success: false,
      error: error?.message || "Failed to get projects",
    };
  }
}

/**
 * UPDATE PROJECT STATUS
 */
export async function updateProjectStatus({ projectId, userId, status }) {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] updateProjectStatus", error);

    return {
      success: false,
      error: error?.message || "Failed to update project status",
    };
  }
}

/**
 * SAVE INTENT PARSER RESULT
 */
export async function saveIntentParserResult({
  projectId,
  userId,
  prompt,
  parsedData,
  theme,
}) {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        status: "slides_generating",

        theme,

        "intentParser.prompt": prompt,

        "intentParser.parsedData": parsedData,

        "intentParser.status": "completed",
      },
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] saveIntentParserResult", error);

    return {
      success: false,
      error: error?.message || "Failed to save intent parser result",
    };
  }
}

/**
 * UPDATE INTENT PARSER STATUS
 */
export async function updateIntentParserStatus({
  projectId,
  userId,
  status,
  error = "",
}) {
  try {
    const updateData = {
      "intentParser.status": status,
    };

    if (error) {
      updateData["intentParser.error"] = error;
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      updateData,
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] updateIntentParserStatus", error);

    return {
      success: false,
      error: error?.message || "Failed to update intent parser status",
    };
  }
}

/**
 * ADD GENERATED SLIDE
 */
export async function addGeneratedSlide({ projectId, userId, slide }) {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        $push: {
          slides: slide,
        },
      },
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] addGeneratedSlide", error);

    return {
      success: false,
      error: error?.message || "Failed to add slide",
    };
  }
}

/**
 * REPLACE ALL SLIDES
 */
export async function replaceProjectSlides({ projectId, userId, slides }) {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        slides,
      },
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] replaceProjectSlides", error);

    return {
      success: false,
      error: error?.message || "Failed to replace slides",
    };
  }
}

/**
 * UPDATE SINGLE SLIDE
 */
export async function updateSlide({
  projectId,
  userId,
  slideId,
  updates = {},
}) {
  try {
    /**
     * CHECK EXISTING SLIDE
     */
    const existingSlide = await Project.findOne({
      _id: projectId,
      userId,
      "slides.slideId": slideId,
    });

    /**
     * UPDATE EXISTING
     */
    if (existingSlide) {
      const updateFields = {};

      Object.keys(updates).forEach((key) => {
        updateFields[`slides.$.${key}`] = updates[key];
      });

      const updatedProject = await Project.findOneAndUpdate(
        {
          _id: projectId,
          userId,
          "slides.slideId": slideId,
        },
        {
          $set: updateFields,
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        data: updatedProject,
      };
    }

    /**
     * CREATE NEW SLIDE
     */
    const createdProject = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        $push: {
          slides: {
            slideId,
            ...updates,
          },
        },
      },
      {
        new: true,
      }
    );

    return {
      success: true,
      data: createdProject,
    };
  } catch (error) {
    console.error("[Project Service] updateSlide", error);

    return {
      success: false,
      error: error?.message || "Failed to update slide",
    };
  }
}

/**
 * SAVE PPTX OUTPUT
 */
export async function saveGeneratedPptx({
  projectId,
  userId,
  url,
  fileName,
  size = 0,
}) {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId,
      },
      {
        status: "completed",

        generatedPptx: {
          url,
          fileName,
          size,
        },
      },
      {
        new: true,
      }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("[Project Service] saveGeneratedPptx", error);

    return {
      success: false,
      error: error?.message || "Failed to save generated pptx",
    };
  }
}

/**
 * ADD LOG
 */
export async function addProjectLog({ projectId, userId, step, message }) {
  try {
    await Project.updateOne(
      {
        _id: projectId,
        userId,
      },
      {
        $push: {
          logs: {
            step,
            message,
            createdAt: new Date(),
          },
        },
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Project Service] addProjectLog", error);

    return {
      success: false,
      error: error?.message || "Failed to add log",
    };
  }
}

/**
 * DELETE PROJECT
 */
export async function deleteProject(projectId, userId) {
  try {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Project Service] deleteProject", error);

    return {
      success: false,
      error: error?.message || "Failed to delete project",
    };
  }
}

export default {
  createProject,

  getProjectById,

  getAllProjects,

  updateProjectStatus,

  saveIntentParserResult,

  updateIntentParserStatus,

  addGeneratedSlide,

  replaceProjectSlides,

  updateSlide,

  saveGeneratedPptx,

  addProjectLog,

  deleteProject,
};
