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
  INTENT_START: "agent:intent:start",
  INTENT_END: "agent:intent:end",
  INTENT_FAILED: "agent:intent:failed",
  PER_SLIDE_CONTENT_START: "agent:per_slide_content:start",
  PER_SLIDE_CONTENT_PROGRESS: "agent:per_slide_content:progress",
  PER_SLIDE_CONTENT_END: "agent:per_slide_content:end",
  PER_SLIDE_CONTENT_FAILED: "agent:per_slide_content:failed",
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
