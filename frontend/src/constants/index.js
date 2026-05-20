export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const SOCKET_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = "SlideAI";

export const PROJECT_STATUS = {
  CREATED: "created",
  PLANNING: "planning",
  GENERATING: "generating",
  RENDERING: "rendering",
  COMPLETED: "completed",
  FAILED: "failed",
  PAUSED: "paused",
  RUNNING: "running",
};

export const STATUS_LABELS = {
  created: "Created",
  planning: "Planning",
  generating: "Generating",
  rendering: "Rendering",
  completed: "Completed",
  failed: "Failed",
  paused: "Paused",
  running: "Running",
};

export const STATUS_COLORS = {
  created: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  planning: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  generating:
    "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  rendering: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  completed:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  paused: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  running: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
};

export const SOCKET_EVENTS = {
  AUTH: "auth",
  READY: "socket:ready",
  PROJECT_START: "project:created:start",
  INTENT_COMPLETED: "intent:completed",
  PROJECT_COMPLETED: "project:completed",
  PROJECT_ERROR: "project:error",
  PROJECT_RESUME: "project:resume",
  PLANNER_START: "planner:start",
  PLANNER_SLIDES_INIT: "planner:slides:initialized",
  PLANNER_SLIDE_STATUS: "planner:slide:status",
  PLANNER_SLIDE_COMPLETE: "planner:slide:complete",
  PLANNER_SLIDE_FAILED: "planner:slide:failed",
  PLANNER_COMPLETED: "planner:completed",
  PLANNER_ERROR: "planner:error",
  CODER_START: "coder:start",
  CODER_COMPLETE: "coder:complete",
  CODER_ERROR: "coder:error",
  EDITOR_START: "editor:start",
  EDITOR_COMPLETED: "editor:completed",
  EDITOR_ERROR: "editor:error",
};

export const QUERY_KEYS = {
  ME: ["me"],
  USER_STATS: ["user-stats"],
  PROJECTS: ["projects"],
  PROJECT: (id) => ["project", id],
  PROJECT_STATUS: (id) => ["project-status", id],
  PROJECT_LOGS: (id) => ["project-logs", id],
  PROJECT_FULL: (id) => ["project-full", id],
  PROJECT_LIST: ["project-list"],
};
