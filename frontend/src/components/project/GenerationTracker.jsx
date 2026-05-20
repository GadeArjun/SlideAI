import { motion } from "framer-motion";

import {
  CheckCircle2,
  Loader2,
  XCircle,
  Sparkles,
  Brain,
  FileText,
  Layers3,
} from "lucide-react";

import { useProjectStore } from "../../store/projectStore";

import { cn } from "../../lib/utils";

/**
 * =========================================
 * STEP CONFIG
 * =========================================
 */
const STEPS = [
  {
    id: "project",

    title: "Project Created",

    description: "Initializing presentation project",

    icon: FileText,
  },

  {
    id: "intent",

    title: "Intent Parser",

    description: "Understanding presentation requirements",

    icon: Brain,
  },

  {
    id: "slides",

    title: "Slide Generation",

    description: "Generating presentation slides",

    icon: Sparkles,
  },

  {
    id: "completed",

    title: "Presentation Ready",

    description: "Presentation generated successfully",

    icon: CheckCircle2,
  },
];

/**
 * =========================================
 * STEP STATUS
 * =========================================
 */
function getStepStatus(gen, stepId) {
  /**
   * FAILED
   */
  if (gen.status === "failed") {
    if (stepId === "intent" && gen.currentAgent === "intent-parser") {
      return "failed";
    }

    if (stepId === "slides" && gen.currentAgent === "per-slide-content") {
      return "failed";
    }
  }

  /**
   * PROJECT
   */
  if (stepId === "project") {
    return "done";
  }

  /**
   * INTENT
   */
  if (stepId === "intent") {
    if (gen.currentAgent === "intent-parser") {
      return gen.status === "completed" ? "done" : "active";
    }

    if (gen.currentAgent === "per-slide-content") {
      return "done";
    }
  }

  /**
   * SLIDES
   */
  if (stepId === "slides") {
    if (gen.currentAgent === "per-slide-content") {
      return gen.status === "completed" ? "done" : "active";
    }

    if (gen.status === "completed") {
      return "done";
    }
  }

  /**
   * COMPLETED
   */
  if (stepId === "completed") {
    return gen.status === "completed" ? "done" : "pending";
  }

  return "pending";
}

/**
 * =========================================
 * STEP ICON
 * =========================================
 */
function StepIndicator({ status, Icon }) {
  if (status === "done") {
    return (
      <div
        className="
          w-10
          h-10
          rounded-2xl
          bg-emerald-100
          dark:bg-emerald-950
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div
        className="
          w-10
          h-10
          rounded-2xl
          bg-blue-100
          dark:bg-blue-950
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className="
          w-10
          h-10
          rounded-2xl
          bg-red-100
          dark:bg-red-950
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <XCircle className="w-5 h-5 text-red-500" />
      </div>
    );
  }

  return (
    <div
      className="
        w-10
        h-10
        rounded-2xl
        bg-[var(--surface-secondary)]
        flex
        items-center
        justify-center
        shrink-0
      "
    >
      <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
    </div>
  );
}

/**
 * =========================================
 * MAIN COMPONENT
 * =========================================
 */
export function GenerationTracker({ projectId }) {
  const gen = useProjectStore((s) => s.activeGenerations[projectId]);

  if (!gen) return null;

  const totalSlides = gen.totalSlides || 0;

  const generatedSlides = gen.generatedSlides || 0;

  const progress = gen.progress || 0;

  const isFailed = gen.status === "failed";

  const isCompleted = gen.status === "completed";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        w-full
  max-w-lg
  mx-auto

  rounded-3xl

  border
  border-[var(--border-primary)]

  bg-[var(--surface-primary)]

  p-2

  max-h-[85vh]

  overflow-y-auto
  overflow-x-hidden

  scrollbar-thin
  scrollbar-thumb-[var(--border-primary)]
  scrollbar-track-transparent

  overscroll-contain
      "
    >
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {!isCompleted && !isFailed && (
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}

            {isCompleted && (
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            )}

            {isFailed && <div className="w-2 h-2 rounded-full bg-red-500" />}

            <h2 className="text-sm sm:text-base font-semibold truncate">
              {isCompleted
                ? "Presentation Ready"
                : isFailed
                ? "Generation Failed"
                : "Generating Presentation"}
            </h2>
          </div>

          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {gen.currentStep || "Preparing presentation"}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xl font-bold">{progress}%</p>
        </div>
      </div>

      {/* ========================================= */}
      {/* PROGRESS */}
      {/* ========================================= */}

      <div className="mt-1">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.4,
            }}
            className={cn(
              `
                h-full
                rounded-full
              `,
              isCompleted
                ? "bg-emerald-500"
                : isFailed
                ? "bg-red-500"
                : "bg-blue-500"
            )}
          />
        </div>
      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div
        className="
          mt-1
          grid
          grid-cols-2
          gap-3
        "
      >
        <div
          className="
            rounded-2xl
            bg-[var(--surface-secondary)]
            p-1
          "
        >
          <p className="text-xs text-[var(--text-secondary)]">Slides</p>

          <div className="mt-1 flex items-center gap-1">
            <Layers3 className="w-4 h-4 text-[var(--text-secondary)]" />

            <p className="text-lg font-semibold">
              {generatedSlides}/{totalSlides}
            </p>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            bg-[var(--surface-secondary)]
            p-2
          "
        >
          <p className="text-xs text-[var(--text-secondary)]">Current Agent</p>

          <p className="mt-1 text-sm font-medium truncate capitalize">
            {gen.currentAgent || "Initializing"}
          </p>
        </div>
      </div>

      {/* ========================================= */}
      {/* STEPS */}
      {/* ========================================= */}

      <div className="mt-2 space-y-1">
        {STEPS.map((step, index) => {
          const status = getStepStatus(gen, step.id);

          return (
            <div key={step.id} className="flex gap-1">
              {/* LEFT */}
              <div className="flex flex-col items-center">
                <StepIndicator status={status} Icon={step.icon} />

                {index !== STEPS.length - 1 && (
                  <div
                    className={cn(
                      `
                        w-px
                        flex-1
                        mt-2
                        min-h-[28px]
                      `,
                      status === "done"
                        ? "bg-emerald-500"
                        : "bg-[var(--border-primary)]"
                    )}
                  />
                )}
              </div>

              {/* RIGHT */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      `
                        text-sm
                        font-medium
                      `,
                      status === "active"
                        ? "text-[var(--text-primary)]"
                        : status === "done"
                        ? "text-emerald-500"
                        : status === "failed"
                        ? "text-red-500"
                        : "text-[var(--text-secondary)]"
                    )}
                  >
                    {step.title}
                  </p>

                  {status === "active" && (
                    <span
                      className="
                        text-[10px]
                        px-2
                        py-0.5
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        dark:bg-blue-950
                        dark:text-blue-400
                      "
                    >
                      Running
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* RECENT LOGS */}
      {/* ========================================= */}

      {gen.logs?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-primary)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Recent Activity
            </p>

            <p className="text-[10px] text-[var(--text-secondary)]">Live</p>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
            {[...gen.logs]
              .reverse()
              .slice(0, 5)
              .map((log, i) => (
                <div
                  key={i}
                  className="
                    text-xs

                    rounded-xl

                    bg-[var(--surface-secondary)]

                    px-3
                    py-2

                    text-[var(--text-secondary)]

                    break-words
                  "
                >
                  {log.message}
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
