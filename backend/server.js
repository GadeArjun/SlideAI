// server.js

import express from "express";
import cors from "cors";
import { config } from "dotenv";

import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";

config();

const app = express();

/**
 * DATABASE
 */
await connectDB();

/**
 * MIDDLEWARES
 */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "AI PPT Generator API Running",
  });
});

/**
 * ROUTES
 */
app.use("/api/user", userRoutes);

app.use("/api/project", projectRoutes);

/**
 * 404
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((error, req, res, next) => {
  console.error("[Global Error]", error);

  return res.status(500).json({
    success: false,
    error: error?.message || "Internal server error",
  });
});

/**
 * SERVER
 */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
