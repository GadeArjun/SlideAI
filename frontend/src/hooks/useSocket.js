// hooks/useSocket.js
import { useEffect, useRef } from "react";

import { socketService } from "../services/socket";

import { useProjectStore } from "../store/projectStore";

import { QUERY_KEYS, SOCKET_EVENTS } from "../constants";

import { toast } from "sonner";
import { queryClient } from "../providers/QueryProvider";

/**
 * =========================================
 * BASIC SOCKET ACCESS
 * =========================================
 */
export function useSocket() {
  return socketService;
}

/**
 * =========================================
 * PROJECT SOCKET HANDLER
 * =========================================
 */
export function useProjectSocket(projectId) {
  const listenersRef = useRef([]);

  const {
    initGeneration,
    updateGeneration,
    addLog,
    removeGeneration,
    updateSlideEdit,
  } = useProjectStore();

  useEffect(() => {
    if (!projectId) return;

    /**
     * INIT PROJECT STATE
     */
    // initGeneration(projectId);
    const existing = useProjectStore.getState().activeGenerations?.[projectId];

    if (!existing) {
      initGeneration(projectId);
    }

    /**
     * =========================================
     * INTENT START
     * =========================================
     */
    const handleIntentStart = (data) => {
      updateGeneration(projectId, {
        status: "running",

        currentAgent: "intent-parser",

        currentStep: data?.message || "Parsing intent...",
      });

      addLog(projectId, {
        type: "info",

        message: `🧠 ${data?.message}`,

        time: Date.now(),
      });
    };

    /**
     * =========================================
     * INTENT END
     * =========================================
     */
    const handleIntentEnd = (data) => {
      updateGeneration(projectId, {
        status: "completed",

        currentAgent: "intent-parser",

        currentStep: data?.message || "Intent completed",
      });

      addLog(projectId, {
        type: "success",

        message: `✅ ${data?.message}`,

        time: Date.now(),
      });
    };

    /**
     * =========================================
     * INTENT FAILED
     * =========================================
     */
    const handleIntentFailed = (data) => {
      updateGeneration(projectId, {
        status: "failed",

        currentAgent: "intent-parser",

        currentStep: "Intent failed",

        error: data?.message,
      });

      addLog(projectId, {
        type: "error",

        message: `❌ ${data?.message}`,

        time: Date.now(),
      });

      toast.error("Intent Parser Failed", {
        description: data?.message,
      });
    };

    /**
     * =========================================
     * PER SLIDE CONTENT START
     * =========================================
     */
    const handlePerSlideStart = (data) => {
      updateGeneration(projectId, {
        status: "running",

        currentAgent: "per-slide-content",

        currentStep: data?.message || "Generating slides...",

        totalSlides: data?.totalSlides || 0,

        generatedSlides: 0,

        progress: 0,
      });

      addLog(projectId, {
        type: "info",

        message: `🎨 ${data?.message}`,

        time: Date.now(),
      });
    };

    /**
     * =========================================
     * PER SLIDE CONTENT PROGRESS
     * =========================================
     */
    const handlePerSlideProgress = (data) => {
      const current = useProjectStore.getState().getGeneration(projectId);

      const generatedSlides = (current?.generatedSlides || 0) + 1;

      const totalSlides = current?.totalSlides || 0;

      const progress =
        totalSlides > 0 ? Math.round((generatedSlides / totalSlides) * 100) : 0;

      updateGeneration(projectId, {
        generatedSlides,

        progress,

        currentAgent: "per-slide-content",

        currentStep: data?.message,
      });

      addLog(projectId, {
        type: "success",

        message: `✅ ${data?.message}`,

        time: Date.now(),
      });
    };

    /**
     * =========================================
     * PER SLIDE CONTENT END
     * =========================================
     */
    const handlePerSlideEnd = (data) => {
      updateGeneration(projectId, {
        status: "completed",

        progress: 100,

        currentAgent: "per-slide-content",

        currentStep: data?.message || "Slides generated",

        completedAt: Date.now(),
      });

      /**
       * REFRESH PROJECT
       */
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(projectId),
      });

      addLog(projectId, {
        type: "success",

        message: `🎉 ${data?.message}`,

        time: Date.now(),
      });

      setTimeout(() => {
        removeGeneration(projectId);
      }, 1000);

      toast.success("Slides Generated", {
        description: data?.message,
      });
    };

    /**
     * =========================================
     * PER SLIDE CONTENT FAILED
     * =========================================
     */
    const handlePerSlideFailed = (data) => {
      updateGeneration(projectId, {
        status: "failed",

        currentAgent: "per-slide-content",

        currentStep: "Slide generation failed",

        error: data?.message,
      });

      addLog(projectId, {
        type: "error",

        message: `❌ ${data?.message}`,

        time: Date.now(),
      });

      setTimeout(() => {
        removeGeneration(projectId);
      }, 1000);

      toast.error("Slide Generation Failed", {
        description: data?.message,
      });
    };

    /**
     * =========================================
     * PER SLIDE EDITPR START
     * =========================================
     */

    const handlePerSlideEditStart = (data) => {
      updateSlideEdit(projectId, data.slideNumber, {
        isEditing: true,

        progress: 5,

        currentStep: data?.message || "Starting slide edit...",

        error: null,

        startedAt: Date.now(),
      });

      addLog(projectId, {
        type: "info",

        message: `✏️ Editing Slide ${data.slideNumber}`,

        time: Date.now(),
      });

      toast.info(`Editing Slide ${data.slideNumber}`, {
        description: data?.message,
      });
    };

    // end
    const handlePerSlideEditEnd = (data) => {
      updateSlideEdit(projectId, data.slideNumber, {
        isEditing: false,

        progress: 100,

        currentStep: "Completed",

        completedAt: Date.now(),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(projectId),
      });

      addLog(projectId, {
        type: "success",

        message: `✅ Slide ${data.slideNumber} edited successfully`,

        time: Date.now(),
      });

      toast.success(`Slide ${data.slideNumber} Updated`);
    };

    // failed

    const handlePerSlideEditFailed = (data) => {
      updateSlideEdit(projectId, data.slideNumber, {
        isEditing: false,

        progress: 0,

        currentStep: "Failed",

        error: data?.message,
      });

      addLog(projectId, {
        type: "error",

        message: `❌ Slide ${data.slideNumber} edit failed`,

        time: Date.now(),
      });

      toast.error(`Slide ${data.slideNumber} Edit Failed`, {
        description: data?.message,
      });
    };

    /**
     * =========================================
     * REGISTER EVENTS
     * =========================================
     */
    const handlers = [
      [SOCKET_EVENTS.INTENT_START, handleIntentStart],

      [SOCKET_EVENTS.INTENT_END, handleIntentEnd],

      [SOCKET_EVENTS.INTENT_FAILED, handleIntentFailed],

      [SOCKET_EVENTS.PER_SLIDE_CONTENT_START, handlePerSlideStart],

      [SOCKET_EVENTS.PER_SLIDE_CONTENT_PROGRESS, handlePerSlideProgress],

      [SOCKET_EVENTS.PER_SLIDE_CONTENT_END, handlePerSlideEnd],

      [SOCKET_EVENTS.PER_SLIDE_CONTENT_FAILED, handlePerSlideFailed],

      [SOCKET_EVENTS.PER_SLIDE_EDITOR_START, handlePerSlideEditStart],

      [SOCKET_EVENTS.PER_SLIDE_EDITOR_END, handlePerSlideEditEnd],

      [SOCKET_EVENTS.PER_SLIDE_EDITOR_FAILED, handlePerSlideEditFailed],
    ];

    /**
     * REGISTER SOCKET LISTENERS
     */
    handlers.forEach(([event, handler]) => {
      const cleanup = socketService.on(event, handler);

      listenersRef.current.push(cleanup);
    });

    /**
     * CLEANUP
     */
    return () => {
      listenersRef.current.forEach((cleanup) => {
        cleanup?.();
      });

      listenersRef.current = [];
    };
  }, [projectId]);
}
