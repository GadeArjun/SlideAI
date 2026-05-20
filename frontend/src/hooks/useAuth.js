import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth";
import { socketService } from "../services/socket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../providers/QueryProvider";

export function useAuth() {
  const store = useAuthStore();
  const navigate = useNavigate();

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { user, token } = res.data.data;
    store.setAuth(user, token);
    socketService.connect();
    socketService.authenticate(user._id);
    toast.success(`Welcome back, ${user.name || user.username}!`);
    navigate("/dashboard");
    return user;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { user, token } = res.data;
    store.setAuth(user, token);
    socketService.connect();
    socketService.authenticate(user._id);
    toast.success("Account created! Welcome aboard.");
    navigate("/dashboard");
    return user;
  };

  const logout = () => {
    store.logout();
    socketService.disconnect();
    queryClient.clear();
    navigate("/auth/login");
    toast.success("Logged out successfully");
  };

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login,
    register,
    logout,
  };
}
