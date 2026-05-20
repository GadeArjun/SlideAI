// lib/mapProjectToGeneration.js

export function mapProjectToGeneration(project) {
  if (!project) {
    return null;
  }

  /**
   * LOGS
   */
  const logs = (project.logs || []).map((log) => ({
    id: log._id,

    type: log.step?.includes("failed") ? "error" : "info",

    step: log.step,

    message: log.message,

    time: new Date(log.createdAt).getTime(),
  }));

  /**
   * TOTAL SLIDES
   */
  const totalSlides = project?.intentParser?.parsedData?.slides?.length || 0;

  /**
   * GENERATED SLIDES
   */
  const generatedSlides = (project?.slides || []).filter(
    (slide) => slide?.status === "completed"
  ).length;

  /**
   * FAILED SLIDES
   */
  const failedSlides = (project?.slides || []).filter(
    (slide) => slide?.status === "failed"
  ).length;

  /**
   * PROGRESS
   */
  let progress = 0;

  if (totalSlides > 0) {
    progress = Math.round((generatedSlides / totalSlides) * 100);
  }

  /**
   * CURRENT AGENT
   */
  let currentAgent = "intent-parser";

  /**
   * CURRENT STEP
   */
  let currentStep = "Analyzing presentation";

  /**
   * STATUS
   */
  let status = "running";

  /**
   * INTENT COMPLETED
   */
  if (project?.intentParser?.status === "completed") {
    currentAgent = "per-slide-content";

    currentStep = "Generating presentation slides";
  }

  /**
   * SLIDES COMPLETED
   */
  if (generatedSlides === totalSlides && totalSlides > 0) {
    status = "completed";

    progress = 100;

    currentAgent = "completed";

    currentStep = "Presentation generated successfully";
  }

  /**
   * FAILED
   */
  if (project?.status === "failed" || failedSlides > 0) {
    status = "failed";

    currentStep = "Presentation generation failed";
  }

  return {
    status,

    progress,

    logs,

    currentAgent,

    currentStep,

    totalSlides,

    generatedSlides,

    completedAt: project?.updatedAt || null,

    error: project?.error || null,
  };
}
