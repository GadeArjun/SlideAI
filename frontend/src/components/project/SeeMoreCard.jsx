import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SeeMoreCard({ index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate("/dashboard/projects")}
      className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--brand)]/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/5 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--brand)]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-violet-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
      </div>

      {/* Preview Area */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 via-violet-50 to-purple-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-grid-pattern" />

        {/* Floating Icons */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute top-6 left-6"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <FolderOpen className="w-5 h-5 text-[var(--brand)]" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute bottom-6 right-6"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
        </motion.div>

        {/* Main Center Card */}
        <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
          <div className="w-24 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-[var(--border)] shadow-2xl flex items-center justify-center">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-[var(--brand)]" />
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              See More Projects
            </h3>

            <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)] group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Explore all your generated presentations, continue editing projects,
            and manage your AI PPT workspace.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            View all projects
          </div>

          <span className="text-xs font-medium text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
            Open Dashboard
          </span>
        </div>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[var(--brand)]/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}
