import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  refreshToken: (token) => api.post("/auth/refresh-token", { refreshToken: token }),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
};
