import api from "../api/axios";

export const authApi = {
  register: (data) => api.post("/user/register", data),
  login: (data) => api.post("/user/login", data),
  getMe: () => api.get("/user/me"),
  updateProfile: (data) => api.patch("/user/profile", data),
  updateSettings: (data) => api.patch("/user/settings", data),
  changePassword: (data) => api.patch("/user/change-password", data),
  getUserStats: () => api.get("/user/stats"),
  deleteAccount: () => api.delete("/user/delete"),
};
