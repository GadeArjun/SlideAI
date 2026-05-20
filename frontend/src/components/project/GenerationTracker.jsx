import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Brain,
  Code2,
  Layers,
} from "lucide-react";
import { useProjectStore } from "../../store/projectStore";
import { cn } from "../../lib/utils";
import { formatDate } from "../../lib/utils";

const STEPS = [
  {
    key: "planning",
    label: "Analyzing prompt",
    icon: Brain,
    agent: "intent_extractor",
  },
  {
    key: "planning",
    label: "Planning slides",
    icon: Sparkles,
    agent: "planner",
  },
  {
    key: "generating",
    label: "Generating slides",
    icon: Code2,
    agent: "coder",
  },
  {
    key: "completed",
    label: "Finalizing presentation",
    icon: Layers,
    agent: "completed",
  },
];

function StepDot({ status }) {
  if (status === "done")
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "active")
    return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
  if (status === "error") return <XCircle className="w-4 h-4 text-red-500" />;
  return (
    <div className="w-4 h-4 rounded-full border-2 border-[var(--border-strong)]" />
  );
}

export function GenerationTracker({ projectId }) {
  const gen = useProjectStore((s) => s.activeGenerations[projectId]);

  if (!gen) return null;

  const statusOrder = [
    "created",
    "planning",
    "generating",
    "rendering",
    "completed",
  ];
  const currentIdx = statusOrder.indexOf(gen.status);

  const progress = gen.progress || 0;
  const totalSlides = gen.totalSlides || 0;
  const generatedSlides = gen.generatedSlides || 0;

  const isCompleted = gen.status === "completed";
  const isFailed = gen.status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isCompleted && !isFailed && (
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
          {isCompleted && (
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
          {isFailed && <div className="w-2 h-2 rounded-full bg-red-500" />}
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {isCompleted
              ? "Presentation Ready!"
              : isFailed
              ? "Generation Failed"
              : "Generating…"}
          </span>
        </div>
        <span className="text-sm font-bold text-[var(--brand)]">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isCompleted
              ? "bg-emerald-500"
              : isFailed
              ? "bg-red-500"
              : "bg-blue-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Stats */}
      {totalSlides > 0 && (
        <div className="flex gap-4 text-xs text-[var(--text-muted)]">
          <span>
            {generatedSlides} / {totalSlides} slides
          </span>
          {gen.currentAgent && <span>· Agent: {gen.currentAgent}</span>}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const stepStatusIdx = statusOrder.indexOf(step.key);
          const stepStatus =
            stepStatusIdx < currentIdx
              ? "done"
              : stepStatusIdx === currentIdx
              ? "active"
              : "pending";
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <StepDot
                status={
                  isFailed && stepStatus === "active" ? "error" : stepStatus
                }
              />
              <Icon
                className={cn(
                  "w-3.5 h-3.5",
                  stepStatus === "done"
                    ? "text-emerald-500"
                    : stepStatus === "active"
                    ? "text-blue-500"
                    : "text-[var(--text-muted)]"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  stepStatus === "active"
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-muted)]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Slide statuses */}
      {Object.keys(gen.slideStatuses || {}).length > 0 && (
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
            Slides
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(gen.slideStatuses).map(([num, status]) => (
              <div
                key={num}
                title={`Slide ${num}: ${status}`}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center",
                  status === "done"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : status === "generating"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                )}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent logs */}
      {gen.logs?.length > 0 && (
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
            Activity
          </p>
          <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar">
            {[...gen.logs]
              .reverse()
              .slice(0, 5)
              .map((log, i) => (
                <p
                  key={i}
                  className="text-xs text-[var(--text-muted)] font-mono"
                >
                  {log.message}
                </p>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
