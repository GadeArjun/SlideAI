// routes/user.routes.js

import express from "express";

import {
  signupController,
  loginController,
  meController,
} from "../controllers/user.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * AUTH
 */
router.post("/signup", signupController);

router.post("/login", loginController);

/**
 * USER
 */
router.get("/me", protect, meController);

export default router;
