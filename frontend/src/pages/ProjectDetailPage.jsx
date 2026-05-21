/**
 * PROJECT DETAIL PAGE
 *
 * UPDATED ARCHITECTURE
 * --------------------------------------------------------
 * - Keeps data.data as the project source
 * - Uses backend theme when present
 * - Falls back to default theme otherwise
 * - Renders slides through your existing templates
 * - No pptxviewjs
 * - No canvas PPT parsing
 * - No aspect-video wrapper for the main preview
 * - Left sidebar width kept the same as before (w-56)
 * - Supports light/dark via your existing index.css dark class flow
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PptxGenJS from "pptxgenjs";
import {
  Download,
  RotateCcw,
  Layers,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  ArrowLeft,
  PanelRightOpen,
  PanelRightClose,
  RefreshCw,
  LayoutGrid,
  ExternalLink,
  FileText,
  PanelLeftOpen,
  PanelLeftClose,
  Sliders,
} from "lucide-react";

import {
  useProject,
  useEditSlide,
  useResumeProject,
  useDeleteProject,
} from "../hooks/useProjects";
import { useProjectSocket } from "../hooks/useSocket";
import { useProjectStore } from "../store/projectStore";
import { GenerationTracker } from "../components/project/GenerationTracker";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { Skeleton } from "../components/common/Skeletons";
import { isActiveStatus } from "../lib/utils";
import { cn } from "../lib/utils";
import { toast } from "sonner";

// HERO
import { heroTemplates } from "../lib/templates/hero";

// CONTENT
import { contentTemplates } from "../lib/templates/content";

// CLOSING
import { closingTemplates } from "../lib/templates/closing";
import { useAuth } from "../hooks/useAuth";
import { socketService } from "../services/socket";
import { mapProjectToGeneration } from "../lib/mapProjectToGeneration";

const templateRegistry = {
  ...heroTemplates,
  ...contentTemplates,
  ...closingTemplates,
};

/**
 * Default theme used only when backend does not provide theme.
 * Backend theme overrides this.
 * Avoided orange-heavy defaults to match your updated neutral style.
 */
const defaultTheme = {
  backgroundColor: "#F8FAFC",
  surfaceColor: "#FFFFFF",
  primaryTextColor: "#18181B",
  secondaryTextColor: "#52525B",
  accentColor: "#0F172A",
  fontFamily: "Inter",
};

const PPT_WIDTH = 960;
const PPT_HEIGHT = 540;

function getSlideTitle(slide) {
  return (
    slide?.plan?.slideTitle ||
    slide?.data?.title ||
    slide?.title ||
    "Untitled Slide"
  );
}

function getSlideSubtitle(slide) {
  return (
    slide?.plan?.slideType ||
    slide?.data?.subtitle ||
    slide?.description ||
    slide?.template ||
    ""
  );
}

function getTemplate(templateName) {
  return templateRegistry[templateName] || null;
}

function SocketTracker({ projectId }) {
  useProjectSocket(projectId);
  return null;
}

function SlideThumb({ slide, num, selected, onClick, theme }) {
  const Template = getTemplate(slide?.template);

  return (
    <button
      onClick={onClick}
      className={cn(
        `
          w-full
          rounded-2xl
          overflow-hidden
          border
          transition-all
          duration-200
          text-left
          group
        `,
        selected
          ? `
              border-zinc-400
              dark:border-zinc-600
              bg-(--surface-secondary)
dark:bg-(--surface-secondary)
              
              shadow-md
            `
          : `
              border-(--border-primary)
              
              bg-(--surface)
              hover:bg-[var(--surface)/50]
            `
      )}
    >
      <div
        className="
          h-28
          overflow-hidden
          relative
          bg-zinc-950
          border-b
          border-(--border-primary)
          
        "
      >
        {Template?.Preview ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-[0.18] origin-center">
              <div
                style={{
                  width: `${PPT_WIDTH}px`,
                  height: `${PPT_HEIGHT}px`,
                }}
              >
                <Template.Preview
                  data={{
                    ...(slide?.data || slide),
                    theme,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-red-500">
            Missing Template
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-(--text-secondary)">
            Slide {num}
          </span>
          <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
        </div>

        <h3 className="mt-2 text-sm font-semibold truncate text-(--text-primary)">
          {getSlideTitle(slide)}
        </h3>

        <p className="mt-1 text-[10px] text-(--text-secondary) truncate">
          {slide?.template}
        </p>
      </div>
    </button>
  );
}

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [selectedSlide, setSelectedSlide] = useState(1);
  const [editPrompt, setEditPrompt] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scale, setScale] = useState(1);

  const previewContainerRef = useRef(null);

  const { data, isLoading, error } = useProject(projectId);
  const { mutate: editSlide, isPending: editing } = useEditSlide();
  const { mutate: resumeProject, isPending: resuming } = useResumeProject();
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const generation = useProjectStore((s) => s.activeGenerations[projectId]);

  const user = useAuth((s) => s.user);
  const userId = user.user.id || user.user._id;
  const hydrateGeneration = useProjectStore((s) => s.hydrateGeneration);

  const slideEdit = useProjectStore(
    (s) => s.slideEdits?.[projectId]?.[selectedSlide]
  );
  const updateSlideEdit = useProjectStore((s) => s.updateSlideEdit);
  /**
   * Keep the original response access pattern:
   * data.data
   */
  const project = data?.data;

  // socket auth connection
  useEffect(() => {
    if (userId && projectId) {
      const socket = socketService.connect();

      if (socket.connected) {
        socketService.emit("auth", userId);
      } else {
        socket.once("connect", () => {
          socketService.emit("auth", userId);
        });
      }
    }
  }, [projectId, user]);

  useEffect(() => {
    if (!project?._id) return;

    hydrateGeneration(project._id, mapProjectToGeneration(project));
  }, [project]);

  /**
   * Backend theme overrides defaults.
   * If you keep theme in project.theme, this will automatically use it.
   */
  const globalTheme = useMemo(() => {
    return {
      ...defaultTheme,
      ...(project?.theme || {}),
    };
  }, [project]);

  /**
   * Normalize slides for both array and object-map shapes.
   * Supports:
   * - slides: []
   * - slides: {1: {...}, 2: {...}}
   */
  const slides = useMemo(() => {
    const raw = project?.slides;

    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === "object") {
      return Object.entries(raw)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([, value], index) => ({
          ...(value || {}),
          slideNumber: index + 1,
        }));
    }

    return [];
  }, [project?.slides]);

  const totalSlides = slides.length || 0;

  const slideNumbers = slides.map((_, i) => i + 1);

  const currentSlide = slides[selectedSlide - 1];

  const CurrentTemplate = useMemo(() => {
    if (!currentSlide?.template) return null;
    return getTemplate(currentSlide.template);
  }, [currentSlide]);

  const isActive = isActiveStatus(project?.status);
  const isCompleted = project?.status === "completed";
  const [showTracking, setShowTracking] = useState(true);

  console.log({ project, generation, isActive });

  const fullPptUrl =
    project?.output?.pptUrl || project?.output?.latest?.outputUrl || "";

  const canPrev = selectedSlide > 1;
  const canNext = selectedSlide < (slideNumbers.length || 1);

  const goPrev = () => {
    setSelectedSlide((n) => Math.max(1, n - 1));
  };

  const goNext = () => {
    setSelectedSlide((n) => Math.min(slideNumbers.length || 1, n + 1));
  };

  const buildRenderData = useCallback(
    (slide) => {
      const slideTheme = {
        ...globalTheme,
        ...(slide?.theme || slide?.data?.theme || {}),
      };

      if (slide?.data) {
        return {
          ...slide.data,
          theme: slideTheme,
        };
      }

      return {
        ...slide,
        theme: slideTheme,
      };
    },
    [globalTheme]
  );

  useEffect(() => {
    if (selectedSlide > slideNumbers.length) {
      setSelectedSlide(1);
    }
  }, [selectedSlide, slideNumbers.length]);

  useEffect(() => {
    const fitScale = () => {
      if (!previewContainerRef.current) return;

      const width = previewContainerRef.current.clientWidth;
      const height = previewContainerRef.current.clientHeight;

      const availableWidth = width - 48;
      const availableHeight = height - 48;

      const nextScale = Math.min(
        1,
        Math.max(
          0.35,
          Math.min(availableWidth / PPT_WIDTH, availableHeight / PPT_HEIGHT)
        )
      );

      setScale(nextScale);
    };

    fitScale();
    window.addEventListener("resize", fitScale);
    return () => window.removeEventListener("resize", fitScale);
  }, [showEditor, isSidebarOpen, currentSlide]);

  const handleExport = async () => {
    try {
      const pptx = new PptxGenJS();

      pptx.layout = "LAYOUT_16x9";
      pptx.author = "AI PPT Generator";
      pptx.company = "AI Presentation Engine";
      pptx.subject =
        project?.intentParser.parsedData.presentation.title || "Presentation";
      pptx.title =
        project?.intentParser.parsedData.presentation.title || "Presentation";

      for (const slide of slides) {
        const Template = getTemplate(slide.template);
        if (!Template?.toPptx) continue;

        const pptSlide = pptx.addSlide();
        const renderData = buildRenderData(slide);

        await Template.toPptx(pptSlide, pptx, renderData);
      }

      const fileName = (
        project?.intentParser.parsedData.presentation.title || "Presentation"
      )
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_")
        .toLowerCase();

      await pptx.writeFile({
        fileName: `${fileName}.pptx`,
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed");
    }
  };

  const handleEditSlide = (e) => {
    e.preventDefault();

    if (!editPrompt.trim()) {
      toast.error("Enter an edit instruction");
      return;
    }
    try {
      updateSlideEdit(projectId, selectedSlide, {
        isEditing: true,
        progress: 5,
        currentStep: "Analyzing slide",
      });
      editSlide(
        {
          projectId,
          slideNumber: selectedSlide,
          userPrompt: editPrompt,
        },
        {
          onSuccess: () => {
            setEditPrompt("");
          },

          onError: () => {
            updateSlideEdit(projectId, selectedSlide, {
              isEditing: false,
              progress: 0,
              currentStep: "Failed",
            });
          },
        }
      );
    } catch (error) {
      updateSlideEdit(projectId, selectedSlide, {
        isEditing: false,
        progress: 0,
        currentStep: "Failed",
      });
      console.error({ error });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-zinc-600 ">Project not found.</p>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="btn-secondary"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <>
      <SocketTracker projectId={projectId} />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() =>
          deleteProject(projectId, {
            onSuccess: () => navigate("/dashboard/projects"),
          })
        }
        loading={deleting}
        title="Delete project?"
        description="All slides and data will be permanently removed."
      />

      <div
        className="flex
    flex-col
    h-[calc(100vh-64px)]
    -m-5
    md:-m-6

    bg-(--surface)
    text-(--text-primary)"
      >
        {/* TOP BAR */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-(--border-primary)  bg-(--surface) shrink-0">
          <button
            onClick={() => navigate("/dashboard/projects")}
            className="btn-ghost p-2"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            className="btn-ghost p-2"
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <h1 className="font-semibold text-sm truncate">
                {project?.intentParser.parsedData.presentation.title ||
                  "Presentation"}
              </h1>
            )}

            {project && (
              <StatusBadge status={project.status} className="mt-0.5" />
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(project?.status === "failed" || project?.status === "paused") && (
              <button
                onClick={() => resumeProject(projectId)}
                disabled={resuming}
                className="btn-secondary text-xs"
              >
                {resuming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                Resume
              </button>
            )}

            <button
              onClick={() => setShowEditor((v) => !v)}
              className={cn(
                "btn-ghost p-2 transition-colors",
                showEditor ? "bg-(--surface-secondary)" : ""
              )}
              title={showEditor ? "Hide AI Editor" : "Show AI Editor"}
            >
              {showEditor ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>

            {fullPptUrl && (
              <a
                href={fullPptUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs"
                title="Download generated PPTX"
              >
                <Download className="w-4 h-4" />
                Download PPTX
              </a>
            )}

            {isActive && generation && !showTracking && (
              <div className="absolute top-35 right-2 z-20">
                <button
                  onClick={() => setShowTracking(true)}
                  className="inline-flex  items-center gap-2       rounded-2xl border border-(--border-primary)       bg-(--surface)/90 backdrop-blur-xl       px-4 py-2 text-xs font-medium text-(--text-primary)shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-(--surface-secondary)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Show Progress
                </button>
              </div>
            )}

            <button onClick={handleExport} className="btn-primary text-xs">
              <Download className="w-4 h-4" />
              Export PPTX
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              className="btn-ghost p-2 text-red-500"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR */}
          <AnimatePresence initial={false}>
            {isSidebarOpen && (
              <motion.div
                key="left-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="
                  border-r
                  border-(--border-primary)
                  bg-(--surface)
                  overflow-y-auto
                  no-scrollbar
                  p-2
                  space-y-2
                  shrink-0
                "
              >
                <p className="text-xs font-semibold text-(--text-secondary) px-1 pt-1">
                  {slideNumbers.length} Slides
                </p>

                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))
                ) : slideNumbers.length === 0 ? (
                  <p className="text-xs text-(--text-secondary) px-1">
                    No slides yet
                  </p>
                ) : (
                  slideNumbers.map((n) => (
                    <SlideThumb
                      key={n}
                      num={n}
                      slide={slides[n - 1]}
                      selected={selectedSlide === n}
                      onClick={() => setSelectedSlide(n)}
                      theme={globalTheme}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CENTER PREVIEW */}
          <div
            className="flex-1 overflow-hidden 
            bg-(--surface-secondary) flex flex-col min-w-0"
          >
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <Skeleton className="w-full max-w-4xl h-128 rounded-3xl" />
              </div>
            ) : isActive && generation && showTracking ? (
              <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0 overflow-y-auto overflow-x-hidden">
                <div className="absolute top-35 right-2">
                  <button
                    onClick={() => setShowTracking(false)}
                    className="
        inline-flex
        items-center
        gap-2

        rounded-2xl

        border

        border-(--border-primary)
        bg-(--surface)/90
        backdrop-blur-xl

        px-4
        py-2

        text-xs
        font-medium

        text-(--text-primary)

        shadow-lg

        transition-all
        duration-200

        hover:scale-[1.02]
        hover:bg-(--surface-secondary)
      "
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Show Slides
                  </button>
                </div>

                {/* TRACKER */}
                <GenerationTracker projectId={projectId} />

                {/* BOTTOM SPACE */}
                <div className="h-10 shrink-0" />
              </div>
            ) : slideNumbers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Layers className="w-12 h-12 text-(--text-secondary)" />
                <p className="text-sm text-(--text-secondary)">
                  No slides generated yet
                </p>
              </div>
            ) : (
              <>
                {/* NAV BAR */}
                <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b border-(--border-primary) bg-(--surface)">
                  <button
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="btn-ghost p-1.5 disabled:opacity-30"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {slideNumbers.map((n) => (
                      <button
                        key={n}
                        onClick={() => setSelectedSlide(n)}
                        className={cn(
                          `
                            min-w-6
                            h-6
                            px-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            transition-all
                          `,
                          n === selectedSlide
                            ? `
                                bg-(--text-secondary)
                                text-(--surface)`
                            : `
                                bg-(--surface)
                                text-(--text-secondary)
                              `
                        )}
                      >
                        {n}
                      </button>
                    ))}

                    {fullPptUrl && (
                      <a
                        href={fullPptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 btn-ghost p-1.5 text-(--text-secondary) hover:text-(--text-primary)"
                        title="Open raw PPTX"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={goNext}
                    disabled={!canNext}
                    className="btn-ghost p-1.5 disabled:opacity-30"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* PREVIEW AREA */}
                {currentSlide?.status === "slide_editing" ||
                slideEdit?.isEditing ? (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-5 rounded-3xl border border-(--border-primary) bg-(--surface)/80 backdrop-blur-xl px-10 py-8 shadow-xl">
                      {/* Loader */}
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-16 h-16 rounded-full border-(--border-primary)`" />

                        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-(--text-primary) animate-spin" />
                      </div>

                      {/* Text */}
                      <div className="text-center space-y-1">
                        <p
                          className="text-base font-semibold 
                        text-(--text-primary)"
                        >
                          Editing Slide {selectedSlide}
                        </p>

                        <p className="text-sm text-(--text-secondary)">
                          AI is improving the presentation...
                        </p>
                      </div>

                      {/* Dots */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-(--text-primary) animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-(--text-primary) animate-bounce [animation-delay:120ms]" />
                        <div className="h-2 w-2 rounded-full bg-(--text-primary) animate-bounce [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    key={selectedSlide}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 p-4 min-h-0 flex items-center justify-center"
                    ref={previewContainerRef}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="
                        rounded-3xl
                        overflow-hidden
                        shadow-[0_10px_40px_rgba(0,0,0,0.12)]
dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                        border
                        border-(--border-primary)
                        bg-(--surface)
                        shrink-0
                      "
                        style={{
                          width: `${PPT_WIDTH}px`,
                          height: `${PPT_HEIGHT}px`,
                          transform: `scale(${scale})`,
                          transformOrigin: "center center",
                        }}
                      >
                        {CurrentTemplate?.Preview ? (
                          <CurrentTemplate.Preview
                            data={buildRenderData(currentSlide)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
                            <div className="text-center space-y-2">
                              <FileText className="w-10 h-10 mx-auto opacity-40" />
                              <p>Template not found:</p>
                              <p className="font-mono text-xs">
                                {currentSlide?.template}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* INFO BAR */}
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-(--border-primary) bg-(--surface) text-xs text-(--text-secondary) shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold truncate  text-(--text-primary)">
                      {getSlideTitle(currentSlide)}
                    </span>

                    <span className="capitalize px-2 py-0.5 rounded-full bg-(--surface-secondary) shrink-0">
                      {currentSlide?.plan?.slideType ||
                        currentSlide?.category ||
                        currentSlide?.template}
                    </span>

                    <span className="hidden lg:inline truncate">
                      {getSlideSubtitle(currentSlide)}
                    </span>
                  </div>

                  <span className="shrink-0">
                    Slide {selectedSlide} / {totalSlides}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* RIGHT EDITOR */}
          <AnimatePresence initial={false}>
            {showEditor && (
              <motion.div
                key="editor"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="
                  border-l
                  border-(--border-primary)
                  dark:border-zinc-900
                  bg-(--surface)
                  flex
                  flex-col
                  shrink-0
                  overflow-hidden
                "
                style={{ minWidth: 0 }}
              >
                <div className="p-4 border-b border-(--border-primary) shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-(--text-secondary)" />
                    <span className="text-sm font-semibold">AI Editor</span>
                  </div>
                  <p className="text-xs text-(--text-secondary) mt-0.5">
                    Edit slide {selectedSlide} with AI
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentSlide && (
                    <div className="rounded-2xl border border-(--border-primary)  p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold leading-tight text-(--text-primary)">
                          {getSlideTitle(currentSlide)}
                        </p>
                        <span
                          className="text-[10px] capitalize px-1.5 py-0.5 rounded-full bg-(--surface-secondary)
dark:bg-(--surface-secondary) shrink-0"
                        >
                          {currentSlide?.category ||
                            currentSlide?.plan?.slideType ||
                            currentSlide?.template}
                        </span>
                      </div>
                      <p className="text-[10px] text-(--text-secondary)">
                        Template: <span>{currentSlide?.template}</span>
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-(--text-secondary) mb-2">
                      Quick edits
                    </p>

                    <div className="space-y-1.5">
                      {[
                        "Improve slide clarity",
                        "Add more description",
                        "Improve visual hierarchy",
                        "Add relevant icons",
                        "Add a chart",
                        "Add a timeline",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => setEditPrompt(s)}
                          className="w-full text-left text-xs px-3 py-2 rounded-xl bg-(--surface-secondary) hover:bg-(--surface-tertiary) transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleEditSlide}
                  className="p-3 border-t border-(--border-primary) space-y-2 shrink-0"
                >
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder={`Describe changes for slide ${selectedSlide}...`}
                    rows={3}
                    className=" w-full  rounded-2xl  border  border-(--border-primary)  bg-(--surface-secondary)  text-(--text-primary)
  placeholder:text-(--text-secondary)  px-3
  py-2.5   text-xs  resize-none   outline-none"
                  />

                  <button
                    type="submit"
                    disabled={
                      editing ||
                      !isCompleted ||
                      !editPrompt.trim() ||
                      currentSlide?.status === "slide_editing" ||
                      slideEdit?.isEditing
                    }
                    className="btn-primary w-full justify-center text-xs disabled:opacity-50"
                  >
                    {editing ||
                    currentSlide?.status === "slide_editing" ||
                    slideEdit?.isEditing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Editing…
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Apply Edit
                      </>
                    )}
                  </button>

                  {!isCompleted && (
                    <p className="text-xs text-center text-(--text-secondary)">
                      Editing available after generation
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
