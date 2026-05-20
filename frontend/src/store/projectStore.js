import { create } from 'zustand'

export const useProjectStore = create((set, get) => ({
  // Active generation tracking
  activeGenerations: {}, // projectId -> { status, progress, logs, currentAgent, currentStep }

  // Current editor project
  editorProject: null,

  initGeneration: (projectId) =>
    set((s) => ({
      activeGenerations: {
        ...s.activeGenerations,
        [projectId]: {
          status: 'created',
          progress: 0,
          logs: [],
          currentAgent: '',
          currentStep: '',
          totalSlides: 0,
          generatedSlides: 0,
          slideStatuses: {},
          completedAt: null,
          error: null,
        },
      },
    })),

  updateGeneration: (projectId, updates) =>
    set((s) => ({
      activeGenerations: {
        ...s.activeGenerations,
        [projectId]: {
          ...(s.activeGenerations[projectId] || {}),
          ...updates,
        },
      },
    })),

  addLog: (projectId, log) =>
    set((s) => {
      const current = s.activeGenerations[projectId]
      if (!current) return s
      return {
        activeGenerations: {
          ...s.activeGenerations,
          [projectId]: {
            ...current,
            logs: [...(current.logs || []).slice(-100), log],
          },
        },
      }
    }),

  updateSlideStatus: (projectId, slideNum, status) =>
    set((s) => {
      const current = s.activeGenerations[projectId]
      if (!current) return s
      return {
        activeGenerations: {
          ...s.activeGenerations,
          [projectId]: {
            ...current,
            slideStatuses: { ...current.slideStatuses, [slideNum]: status },
          },
        },
      }
    }),

  removeGeneration: (projectId) =>
    set((s) => {
      const next = { ...s.activeGenerations }
      delete next[projectId]
      return { activeGenerations: next }
    }),

  getGeneration: (projectId) => get().activeGenerations[projectId],

  setEditorProject: (project) => set({ editorProject: project }),
  clearEditorProject: () => set({ editorProject: null }),
}))
