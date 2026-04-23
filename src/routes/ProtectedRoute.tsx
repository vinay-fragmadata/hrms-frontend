import { memo, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

export interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = memo(function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
})
