import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'

export function ProtectedRoute({ children, permission }: { children: ReactNode; permission?: string }) {
  const { user, loading, can } = useAuth()
  if (loading) return <div className="center-screen">Memuat sesi...</div>
  if (!user) return <Navigate to="/cms/login" replace />
  if (permission && !can(permission)) return <Navigate to="/cms" replace />
  return children
}
