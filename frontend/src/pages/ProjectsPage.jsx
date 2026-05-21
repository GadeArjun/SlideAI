import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProjectCardSkeleton } from "../components/common/Skeletons";
import { EmptyState } from "../components/common/EmptyState";

const STATUS_FILTERS = ["all", "completed", "generating", "planning", "failed"];

export function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 12,
    ...(search && { search }),
    ...(status !== "all" && { status }),
  };

  const { data, isLoading, isFetching } = useProjects(params);
  const projects = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--text-primary)">Projects</h1>
          <p className="text-sm text-(--text-secondary) mt-0.5">
            {projects.length || 0} total presentations
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                status === s
                  ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                  : "bg-(--bg-tertiary) text-(--text-secondary) hover:text-(--text-primary)"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={search ? "No results found" : "No projects yet"}
          description={
            search
              ? `No projects match "${search}"`
              : "Create your first AI-powered presentation."
          }
          action={
            !search
              ? {
                  label: "Create Presentation",
                  onClick: () => navigate("/dashboard/create"),
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} />
            ))}
          </div>
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-(--text-muted) px-2">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
