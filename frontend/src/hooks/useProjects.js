import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import { authApi } from "../api/auth";
import { QUERY_KEYS } from "../constants";
import { getErrorMessage } from "../lib/utils";
import { toast } from "sonner";

export function useProjects(params = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, params],
    queryFn: () =>
      projectsApi.getAll(params).then((r) => {
        console.log({ r });
        return r.data;
      }),
  });
}

export function useProjectList() {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT_LIST,
    queryFn: () => projectsApi.getList().then((r) => r.data),
  });
}

export function useProject(projectId) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT(projectId),
    queryFn: () => projectsApi.getById(projectId).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useProjectStatus(projectId, enabled = false) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT_STATUS(projectId),
    queryFn: () => projectsApi.getStatus(projectId).then((r) => r.data),
    enabled: !!projectId && enabled,
    refetchInterval: enabled ? 4000 : false,
  });
}

export function useProjectFull(projectId) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT_FULL(projectId),
    queryFn: () => projectsApi.getFull(projectId).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_LIST });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId) =>
      projectsApi.delete(projectId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_LIST });
      toast.success("Project deleted");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useResumeProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId) =>
      projectsApi.resume(projectId).then((r) => r.data),
    onSuccess: () => toast.success("Resuming generation..."),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useEditSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, slideNumber, userPrompt }) =>
      projectsApi
        .editSlide(projectId, { slideNumber, userPrompt })
        .then((r) => r.data),
    onSuccess: (_, vars) => {
      toast.success("AI is editing the slide...");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_STATS,
    queryFn: () => authApi.getUserStats().then((r) => r.data),
  });
}
