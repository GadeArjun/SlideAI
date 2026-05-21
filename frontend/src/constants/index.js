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
  intent_processing: "Planning",
  slides_generating: "Generating",
  completed: "Completed",
};

export const STATUS_COLORS = {
  intent_processing:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",

  slides_generating:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",

  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
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
  PER_SLIDE_EDITOR_START: "agent:per_slide_edit:start",
  PER_SLIDE_EDITOR_END: "agent:per_slide_edit:end",
  PER_SLIDE_EDITOR_FAILED: "agent:per_slide_edit:failed",
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
