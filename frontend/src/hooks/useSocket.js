import { useEffect, useRef } from 'react'
import { socketService } from '../services/socket'
import { useProjectStore } from '../store/projectStore'
import { SOCKET_EVENTS } from '../constants'
import { queryClient } from '../providers/QueryProvider'
import { QUERY_KEYS } from '../constants'
import { toast } from 'sonner'

export function useSocket() {
  return socketService
}

export function useProjectSocket(projectId) {
  const { updateGeneration, addLog, updateSlideStatus, initGeneration } = useProjectStore()
  const listenersRef = useRef([])

  useEffect(() => {
    if (!projectId) return

    initGeneration(projectId)

    const handlers = [
      [SOCKET_EVENTS.PROJECT_START, (data) => {
        updateGeneration(projectId, { status: 'planning', currentStep: 'Starting generation...' })
      }],
      [SOCKET_EVENTS.INTENT_COMPLETED, (data) => {
        updateGeneration(projectId, {
          status: 'planning',
          currentStep: 'Intent extracted',
          totalSlides: data?.totalSlides || 0,
        })
        addLog(projectId, { type: 'info', message: '✅ Intent extracted', time: Date.now() })
      }],
      [SOCKET_EVENTS.PLANNER_START, (data) => {
        updateGeneration(projectId, { status: 'planning', currentAgent: 'planner', currentStep: 'Planning slides...' })
        addLog(projectId, { type: 'info', message: '🧠 Planner started', time: Date.now() })
      }],
      [SOCKET_EVENTS.PLANNER_SLIDES_INIT, (data) => {
        updateGeneration(projectId, { totalSlides: data?.totalSlides || 0 })
      }],
      [SOCKET_EVENTS.PLANNER_SLIDE_STATUS, (data) => {
        if (data?.slideNumber) {
          updateSlideStatus(projectId, data.slideNumber, data.status || 'planning')
        }
        updateGeneration(projectId, { currentStep: `Planning slide ${data?.slideNumber}...` })
      }],
      [SOCKET_EVENTS.PLANNER_SLIDE_COMPLETE, (data) => {
        if (data?.slideNumber) {
          updateSlideStatus(projectId, data.slideNumber, 'planned')
        }
      }],
      [SOCKET_EVENTS.PLANNER_COMPLETED, (data) => {
        updateGeneration(projectId, { status: 'generating', currentAgent: 'coder', currentStep: 'Generating slides...' })
        addLog(projectId, { type: 'success', message: '✅ Planning complete', time: Date.now() })
      }],
      [SOCKET_EVENTS.CODER_START, (data) => {
        updateGeneration(projectId, {
          status: 'generating',
          currentAgent: 'coder',
          currentStep: `Generating slide ${data?.slideNumber || ''}...`,
        })
        if (data?.slideNumber) updateSlideStatus(projectId, data.slideNumber, 'generating')
        addLog(projectId, { type: 'info', message: `🎨 Generating slide ${data?.slideNumber}`, time: Date.now() })
      }],
      [SOCKET_EVENTS.CODER_COMPLETE, (data) => {
        const gen = parseInt(data?.generatedSlides || 0)
        const total = parseInt(data?.totalSlides || 0)
        updateGeneration(projectId, {
          generatedSlides: gen,
          progress: total > 0 ? Math.round((gen / total) * 100) : 0,
        })
        if (data?.slideNumber) updateSlideStatus(projectId, data.slideNumber, 'done')
        // Invalidate project query so preview updates
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(projectId) })
      }],
      [SOCKET_EVENTS.PROJECT_COMPLETED, (data) => {
        updateGeneration(projectId, {
          status: 'completed',
          progress: 100,
          currentStep: 'Presentation ready!',
          completedAt: Date.now(),
          outputUrl: data?.outputUrl,
        })
        addLog(projectId, { type: 'success', message: '🎉 Presentation complete!', time: Date.now() })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(projectId) })
        toast.success('Presentation generated!', { description: 'Your slides are ready to download.' })
      }],
      [SOCKET_EVENTS.PROJECT_ERROR, (data) => {
        updateGeneration(projectId, {
          status: 'failed',
          error: data?.error || 'Generation failed',
          currentStep: 'Failed',
        })
        addLog(projectId, { type: 'error', message: `❌ ${data?.error || 'Error occurred'}`, time: Date.now() })
        toast.error('Generation failed', { description: data?.error })
      }],
      [SOCKET_EVENTS.EDITOR_START, (data) => {
        updateGeneration(projectId, { status: 'running', currentStep: `Editing slide ${data?.slideNumber}...` })
      }],
      [SOCKET_EVENTS.EDITOR_COMPLETED, (data) => {
        updateGeneration(projectId, { status: 'completed', currentStep: 'Slide updated!' })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(projectId) })
        toast.success(`Slide ${data?.slideNumber} updated!`)
      }],
      [SOCKET_EVENTS.EDITOR_ERROR, (data) => {
        updateGeneration(projectId, { status: 'failed', error: data?.error })
        toast.error('Edit failed', { description: data?.error })
      }],
    ]

    handlers.forEach(([event, handler]) => {
      const cleanup = socketService.on(event, handler)
      listenersRef.current.push(cleanup)
    })

    return () => {
      listenersRef.current.forEach((fn) => fn?.())
      listenersRef.current = []
    }
  }, [projectId])
}
