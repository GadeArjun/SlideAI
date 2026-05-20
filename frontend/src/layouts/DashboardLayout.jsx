import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/dashboard/Sidebar'
import { Topbar } from '../components/dashboard/Topbar'
import { useUIStore } from '../store/uiStore'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { socketService } from '../services/socket'

export function DashboardLayout() {
  const { sidebarOpen, sidebarCollapsed } = useUIStore()
  const { user } = useAuth()

  // Connect socket when entering dashboard
  useEffect(() => {
    if (user?._id) {
      socketService.connect()
      socketService.authenticate(user._id)
    }
    return () => {} // keep socket alive across nav
  }, [user?._id])

  const sidebarW = !sidebarOpen ? 0 : sidebarCollapsed ? 72 : 240

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div
        className="flex flex-col min-h-screen transition-all duration-250"
        style={{ marginLeft: sidebarW }}
      >
        <Topbar />
        <main className="flex-1 p-5 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}
