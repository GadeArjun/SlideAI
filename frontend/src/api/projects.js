import api from '../api/axios'

export const projectsApi = {
  create: (data) => api.post('/project/create', data),
  getAll: (params) => api.get('/project/', { params }),
  getList: () => api.get('/project/list/all'),
  getById: (projectId) => api.get(`/project/${projectId}`),
  getStatus: (projectId) => api.get(`/project/${projectId}/status`),
  getLogs: (projectId) => api.get(`/project/${projectId}/logs`),
  getFull: (projectId) => api.get(`/project/${projectId}/full`),
  resume: (projectId) => api.post(`/project/${projectId}/resume`),
  editSlide: (projectId, data) => api.post(`/project/${projectId}/edit-slide`, data),
  delete: (projectId) => api.delete(`/project/${projectId}`),
}
