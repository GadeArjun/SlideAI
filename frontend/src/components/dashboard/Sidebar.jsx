import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderOpen, Plus, Settings, User,
  LogOut, Layers, ChevronLeft, ChevronRight, Sparkles,
  BarChart2, CreditCard
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useAuth } from '../../hooks/useAuth'
import { getInitials, generateAvatarColor } from '../../lib/utils'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/dashboard/create', icon: Plus, label: 'Create', highlight: true },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, toggleCollapsed } = useUIStore()
  const { user, logout } = useAuth()
  const collapsed = sidebarCollapsed

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0, width: collapsed ? 72 : 240 }}
          exit={{ x: -260 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed left-0 top-0 h-full z-30 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] shrink-0"
          style={{ width: collapsed ? 72 : 240 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--border)]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-[var(--text-primary)] text-sm tracking-tight"
              >
                SlideAI
              </motion.span>
            )}
            <div className="ml-auto">
              <button
                onClick={toggleCollapsed}
                className="btn-ghost p-1.5 rounded-lg"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
            {NAV.map(({ to, icon: Icon, label, highlight, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                      : highlight
                      ? 'text-[var(--brand)] hover:bg-blue-50 dark:hover:bg-blue-950'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                  )
                }
                title={collapsed ? label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
                {!collapsed && highlight && (
                  <span className="ml-auto">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="p-2 border-t border-[var(--border)]">
            <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl', !collapsed && 'min-w-0')}>
              <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br shrink-0 flex items-center justify-center text-white text-xs font-bold', generateAvatarColor(user?.name || user?.username || ''))}>
                {getInitials(user?.name || user?.username || 'U')}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name || user?.username}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                </div>
              )}
              {!collapsed && (
                <button onClick={logout} className="btn-ghost p-1.5 shrink-0" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
            {collapsed && (
              <button onClick={logout} className="btn-ghost w-full flex justify-center py-2" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
