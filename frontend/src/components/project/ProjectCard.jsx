import { motion } from "framer-motion";
import {
  MoreVertical,
  Download,
  Trash2,
  Play,
  RotateCcw,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { useDeleteProject, useResumeProject } from "../../hooks/useProjects";
import {
  formatDate,
  truncate,
  isActiveStatus,
  isFailedStatus,
} from "../../lib/utils";
import { cn } from "../../lib/utils";

export function ProjectCard({ project, index = 0 }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const { mutate: resumeProject } = useResumeProject();

  const isActive = isActiveStatus(project.status);
  const isFailed = isFailedStatus(project.status);
  const isCompleted = project.status === "completed";
  const pptUrl = project.output?.pptUrl || project.output?.latest?.outputUrl;

  const handleDelete = () => {
    deleteProject(project._id, { onSuccess: () => setDeleteOpen(false) });
  };

  const slideCount = project.totalSlides || 0;
  const generated = project.generatedSlides || 0;
  const progress =
    slideCount > 0
      ? Math.round((generated / slideCount) * 100)
      : project.progress || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card group hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/dashboard/projects/${project._id}`)}
      >
        {/* Preview area */}
        <div className="relative h-36 bg-linear-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-20 h-14 rounded-lg bg-white dark:bg-zinc-800 shadow-lg border border-(--border) flex items-center justify-center">
              <FileText className="w-8 h-8 text-(--brand)" />
            </div>
          </div>
          {isActive && (
            <div className="absolute bottom-2 left-3 right-3">
              <div className="h-1.5 rounded-full bg-white/40 dark:bg-black/20 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          )}
          {/* Actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isCompleted && pptUrl && (
                <a
                  href={pptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-(--brand)" />
                </a>
              )}
              {(isFailed || project.status === "paused") && (
                <button
                  onClick={() => resumeProject(project._id)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  title="Resume"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-(--text-primary) truncate">
                {project.intentParser.parsedData.presentation.title ||
                  "Untitled Project"}
              </h3>
              <p className="text-xs text-(--text-muted) mt-0.5 line-clamp-2">
                {truncate(project.userPromt, 80)}
              </p>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative shrink-0"
            >
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-7 z-50 card min-w-36 py-1 shadow-lg">
                    {isCompleted && pptUrl && (
                      <a
                        href={pptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-tertiary)"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setDeleteOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 w-full text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <StatusBadge status={project.status} />
            <div className="flex items-center gap-2 text-xs text-(--text-muted)">
              {slideCount > 0 && <span>{slideCount} slides</span>}
              <span>·</span>
              <span>{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project?"
        description="This action cannot be undone. The project and all its slides will be permanently deleted."
      />
    </>
  );
}
