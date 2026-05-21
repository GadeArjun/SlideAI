// routes/project.routes.js

import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createPresentationController,
  getProjectController,
  getAllProjectsController,
  deleteProjectController,
  pausePipelineController,
  resumePipelineController,
  getPipelineStateController,
  editPresentationController,
  getAnalytics,
} from "../controllers/project.controller.js";

const router = express.Router();

/**
 * CREATE PRESENTATION
 */
router.post("/create", protect, createPresentationController);

/**
 * GET ALL PROJECTS
 */
router.get("/", protect, getAllProjectsController);

/**
 * GET ANALYTICS
 */

router.get("/analytics", protect, getAnalytics);

/**
 * GET SINGLE PROJECT
 */
router.get("/:projectId", protect, getProjectController);

/**
 * DELETE PROJECT
 */
router.delete("/:projectId", protect, deleteProjectController);

/**
 * PAUSE PIPELINE
 */
router.post("/:projectId/pause", protect, pausePipelineController);

/**
 * RESUME PIPELINE
 */
router.post("/:projectId/resume", protect, resumePipelineController);

/**
 * PIPELINE STATE
 */
router.get("/:projectId/state", protect, getPipelineStateController);

/**
 * PRESENTATION EDIT
 */
router.post("/:projectId/edit-slide", protect, editPresentationController);

export default router;
