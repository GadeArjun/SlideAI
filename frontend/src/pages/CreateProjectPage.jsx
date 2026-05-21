import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Send,
  Loader2,
  Upload,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../hooks/useProjects";
import { useProjectStore } from "../store/projectStore";
import { GenerationTracker } from "../components/project/GenerationTracker";
import { toast } from "sonner";

const EXAMPLE_PROMPTS = [
  "Create a 8-slide pitch deck for an AI startup that helps HR teams automate recruitment.",
  "Build a 6-slide business proposal for a SaaS product targeting e-commerce brands.",
  "Design a 10-slide presentation about climate change and renewable energy solutions.",
  "Make a 5-slide product roadmap for a mobile fitness app with Q1-Q4 milestones.",
];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const { mutate: createProject, isPending } = useCreateProject();
  const generation = useProjectStore((s) =>
    activeProjectId ? s.activeGenerations[activeProjectId] : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    createProject(
      { prompt },
      {
        onSuccess: (data) => {
          console.log({ data });
          // Project is started in background, we need to track via socket
          // Backend doesn't return projectId on create (fire-and-forget)
          // We'll navigate to projects page to see it appear
          if (data.success) {
            toast.success("Generation started! Check your projects.");
            setTimeout(
              () => navigate(`/dashboard/projects/${data.data.projectId}`),
              1500
            );
          }
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-(--text-primary)">
          Create Presentation
        </h1>
        <p className="text-sm text-(--text-secondary) mt-0.5">
          Describe your presentation and AI will generate it for you.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleSubmit}
        className="card p-5 space-y-4"
      >
        <div>
          <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wide mb-2 block">
            Your Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the presentation you want to create. Be specific about the topic, number of slides, style, and audience…"
            rows={6}
            className="input-field resize-none"
          />
          <p className="text-xs text-(--text-muted) mt-1.5">
            {prompt.length} characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || !prompt.trim()}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Starting generation…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Presentation
            </>
          )}
        </button>
      </motion.form>

      {/* File upload - coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 border-dashed"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-(--bg-tertiary) flex items-center justify-center">
            <Upload className="w-5 h-5 text-(--text-muted)" />
          </div>
          <div>
            <p className="text-sm font-semibold text-(--text-primary)">
              Upload Document
            </p>
            <p className="text-xs text-(--text-muted)">
              Generate from DOCX or PDF —{" "}
              <span className="text-amber-500 font-medium">Coming Soon</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Example prompts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-3">
          Example Prompts
        </h2>
        <div className="space-y-2">
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="w-full card p-3.5 text-left flex items-start gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
            >
              <FileText className="w-4 h-4 text-(--text-muted) mt-0.5 shrink-0" />
              <span className="text-sm text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                {ex}
              </span>
              <ChevronRight className="w-4 h-4 text-(--text-muted) ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
