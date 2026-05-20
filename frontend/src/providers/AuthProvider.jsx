import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { authApi } from "../api/auth";

export function AuthProvider({ children }) {
  const { token, setAuth, logout, setLoading, isAuthenticated } =
    useAuthStore();
  const { theme, setTheme } = useUIStore();

  // Apply persisted theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        const user = res.data.data;
        setAuth(user, token);
      } catch {
        logout();
      }
    };
    restore();
  }, []);

  return children;
}
