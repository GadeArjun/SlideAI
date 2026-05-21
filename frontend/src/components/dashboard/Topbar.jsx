import { Menu, Sun, Moon, Bell, Search } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuth } from "../../hooks/useAuth";
import { getInitials, generateAvatarColor } from "../../lib/utils";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Topbar({ title }) {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-(--border) bg-(--surface) flex items-center px-5 gap-4 sticky top-0 z-20">
      <button onClick={toggleSidebar} className="btn-ghost p-2 -ml-2">
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="font-semibold text-(--text-primary) text-sm hidden sm:block">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="btn-ghost p-2">
        {theme === "light" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>

      {/* Notifications */}
      <button className="btn-ghost p-2 relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
      </button>

      {/* User avatar */}
      <div className="relative">
        <button
          onClick={() => setDropOpen((p) => !p)}
          className={cn(
            "w-8 h-8 rounded-full bg-linear-to-br flex items-center justify-center text-white text-xs font-bold cursor-pointer",
            generateAvatarColor(user?.name || user?.username || "")
          )}
        >
          {getInitials(user?.name || user?.username || "U")}
        </button>
        {dropOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setDropOpen(false)}
            />
            <div className="absolute right-0 top-10 z-40 card min-w-44 py-1 shadow-lg">
              <div className="px-3 py-2 border-b border-(--border)">
                <p className="text-xs font-semibold text-(--text-primary)">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-(--text-muted) truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  navigate("/dashboard/profile");
                  setDropOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setDropOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
              >
                Settings
              </button>
              <div className="border-t border-(--border) mt-1 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setDropOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
