import { motion } from "framer-motion";
import {
  FolderOpen,
  Layers,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProjects, useUserStats } from "../hooks/useProjects";
import { ProjectCard } from "../components/project/ProjectCard";
import { DashboardSkeleton } from "../components/common/Skeletons";
import { EmptyState } from "../components/common/EmptyState";
import { formatNumber } from "../lib/utils";
import { SeeMoreCard } from "../components/project/SeeMoreCard";

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div
        className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
    </motion.div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projectsData, isLoading } = useProjects({ limit: 6 });
  const { data: statsData } = useUserStats();

  const projects = projectsData?.data || [];
  console.log({ projectsData, projects });
  const stats = statsData?.stats || {};

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
            , {user?.name || user?.username} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Here's what's happening with your presentations.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="btn-primary hidden sm:flex"
        >
          <Plus className="w-4 h-4" /> New Presentation
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderOpen}
          label="Total Projects"
          value={formatNumber(projects.length || 0)}
          color="bg-blue-500"
          delay={0.05}
        />
        <StatCard
          icon={Layers}
          label="Slides Generated"
          value={formatNumber(
            projects
              .map((project) => project.slides.length)
              .reduce((a, total) => total + a, 0) || 0
          )}
          color="bg-violet-500"
          delay={0.1}
        />
        <StatCard
          icon={Zap}
          label="Tokens Used"
          value={formatNumber(user?.totalTokensUsed || 0)}
          color="bg-amber-500"
          delay={0.15}
        />
        {/* <StatCard
          icon={TrendingUp}
          label="Active Projects"
          value={
            projects.filter((p) =>
              ["planning", "generating", "running"].includes(p.status)
            ).length
          }
          color="bg-emerald-500"
          delay={0.2}
        /> */}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate("/dashboard/create")}
            className="card p-4 flex items-center gap-4 text-left hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                New Presentation
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Generate from a prompt
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate("/dashboard/projects")}
            className="card p-4 flex items-center gap-4 text-left hover:border-violet-300 dark:hover:border-violet-700 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900 transition-colors">
              <FolderOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                View All Projects
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Browse your presentations
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Recent Projects
          </h2>
          <button
            onClick={() => navigate("/dashboard/projects")}
            className="btn-ghost text-xs"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create your first AI-powered presentation to get started."
            action={{
              label: "Create Presentation",
              onClick: () => navigate("/dashboard/create"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(
              (p, i) =>
                i < 5 && <ProjectCard key={p._id} project={p} index={i} />
            )}
            <SeeMoreCard index={5} />
          </div>
        )}
      </div>
    </div>
  );
}
