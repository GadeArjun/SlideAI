import { emitToUser } from "../config/socket.js";
import Project from "../models/Project.model.js";
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

function calculateGenerationTime(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return 0;
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const startLog = sortedLogs.find((log) => log.step === "intent_parser");

  const endLog = [...sortedLogs]
    .reverse()
    .find(
      (log) =>
        log.step === "slide_generation" &&
        (log.message === "Slides generated successfully" ||
          log.message === "Pipeline completed")
    );

  if (!startLog || !endLog) {
    return 0;
  }

  const start = new Date(startLog.createdAt).getTime();

  const end = new Date(endLog.createdAt).getTime();

  if (isNaN(start) || isNaN(end)) {
    return 0;
  }

  return Math.max(0, end - start);
}

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    console.log({ userId, user: req.user });

    const objectUserId = userId;

    /*
    OVERVIEW STATS
    */

    const overview = await Project.aggregate([
      {
        $match: {
          userId: objectUserId,
        },
      },

      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,

                totalProjects: {
                  $sum: 1,
                },

                completedProjects: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                  },
                },

                failedProjects: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
                  },
                },

                draftProjects: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "draft"] }, 1, 0],
                  },
                },

                totalSlides: {
                  $sum: {
                    $size: "$slides",
                  },
                },

                avgSlidesPerProject: {
                  $avg: {
                    $size: "$slides",
                  },
                },

                totalLogs: {
                  $sum: {
                    $size: "$logs",
                  },
                },
              },
            },
          ],

          statusDistribution: [
            {
              $group: {
                _id: "$status",
                count: {
                  $sum: 1,
                },
              },
            },
          ],

          categoryDistribution: [
            {
              $unwind: "$slides",
            },

            {
              $group: {
                _id: "$slides.category",
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                count: -1,
              },
            },
          ],

          templateUsage: [
            {
              $unwind: "$slides",
            },

            {
              $group: {
                _id: "$slides.template",
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                count: -1,
              },
            },

            {
              $limit: 15,
            },
          ],

          templateDirectionUsage: [
            {
              $unwind: "$slides",
            },

            {
              $group: {
                _id: "$slides.templateDirection",
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                count: -1,
              },
            },
          ],

          themeUsage: [
            {
              $group: {
                _id: "$theme.fontFamily",

                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                count: -1,
              },
            },
          ],

          recentProjects: [
            {
              $sort: {
                createdAt: -1,
              },
            },

            {
              $limit: 10,
            },

            {
              $project: {
                title: "$intentParser.parsedData.presentation.title",
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                slidesCount: {
                  $size: "$slides",
                },

                logsCount: {
                  $size: "$logs",
                },
              },
            },
          ],

          dailyProjects: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },

                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);

    /*
    
    | EDIT ANALYTICS
    
    */

    const editAnalytics = await Project.aggregate([
      {
        $match: {
          userId: objectUserId,
        },
      },

      {
        $unwind: "$logs",
      },

      {
        $match: {
          "logs.step": {
            $in: [
              "slide_edit_started",
              "slide_edit_completed",
              "slide_edit_failed",
            ],
          },
        },
      },

      {
        $group: {
          _id: "$logs.step",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    /*
    
    | GENERATION TIME ANALYTICS
    
    */

    const projects = await Project.find({
      userId: objectUserId,
    })
      .select({
        logs: 1,
        slides: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        "intentParser.parsedData.presentation.title": 1,
      })
      .lean();

    const projectsWithTiming = projects.map((project) => {
      const generationTimeMs = calculateGenerationTime(project.logs);

      return {
        ...project,
        generationTimeMs,
      };
    });

    const generationTimes = projectsWithTiming
      .map((p) => p.generationTimeMs)
      .filter((t) => t > 0);

    const avgGenerationTime =
      generationTimes.reduce((a, b) => a + b, 0) /
      (generationTimes.length || 1);

    const maxGenerationTime = Math.max(...generationTimes, 0);

    const minGenerationTime =
      generationTimes.length > 0 ? Math.min(...generationTimes) : 0;

    const generationAnalytics = {
      avgGenerationTime,
      maxGenerationTime,
      minGenerationTime,
    };

    /*
    
    | LOG ANALYTICS
    
    */

    const logsAnalytics = await Project.aggregate([
      {
        $match: {
          userId: objectUserId,
        },
      },

      {
        $unwind: "$logs",
      },

      {
        $group: {
          _id: "$logs.step",

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

    /*
    
    | MOST EDITED PROJECTS
    
    */

    const mostEditedProjects = await Project.aggregate([
      {
        $match: {
          userId: objectUserId,
        },
      },

      {
        $project: {
          title: "$intentParser.parsedData.presentation.title",

          editCount: {
            $size: {
              $filter: {
                input: "$logs",
                as: "log",

                cond: {
                  $eq: ["$$log.step", "slide_edit_completed"],
                },
              },
            },
          },
        },
      },

      {
        $sort: {
          editCount: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    /*
    
    | RESPONSE
    
    */

    console.log(
      JSON.stringify(
        {
          overview: overview[0],

          edits: editAnalytics,

          generation: generationAnalytics,

          logs: logsAnalytics,

          mostEditedProjects,
        },
        null,
        2
      )
    );

    return res.status(200).json({
      success: true,

      analytics: {
        overview: overview[0],

        edits: editAnalytics,

        generation: generationAnalytics,

        logs: logsAnalytics,

        mostEditedProjects,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};

export default {
  createPresentationController,

  getProjectController,

  getAllProjectsController,

  deleteProjectController,

  pausePipelineController,

  resumePipelineController,

  getPipelineStateController,

  editPresentationController,

  getAnalytics,
};
