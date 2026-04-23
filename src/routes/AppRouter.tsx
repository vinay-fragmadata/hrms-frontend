import { lazy, memo, Suspense, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoadingFallback } from '@/components/ui/LoadingFallback'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const DashboardPage = lazy(async () => import('@/pages/DashboardPage'))
const EmployeesPage = lazy(async () => import('@/pages/EmployeesPage'))
const TimesheetPage = lazy(async () => import('@/pages/TimesheetPage'))
const LoginPage = lazy(async () => import('@/pages/LoginPage'))
const SignupPage = lazy(async () => import('@/pages/SignupPage'))

export const AppRouter = memo(function AppRouter() {
  const fallback = useMemo(() => <LoadingFallback />, [])

  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/timesheet" element={<TimesheetPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
})
