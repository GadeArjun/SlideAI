import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { GlobalLoader } from '../components/common/GlobalLoader'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <GlobalLoader />
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return <Outlet />
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <GlobalLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
