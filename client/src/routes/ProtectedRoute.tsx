import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageSpinner } from '../components/ui/Spinner'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Waiting matters: without it, refreshing on an admin page would redirect to
  // the login screen before the session check had a chance to resolve.
  if (isLoading) return <PageSpinner label="Checking your session…" />

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
