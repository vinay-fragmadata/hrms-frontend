import { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthToggleLink } from '@/components/auth/AuthToggleLink'
import { LoginForm } from '@/components/auth/LoginForm'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

const LoginPage = memo(function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your HRMS workspace with your work email."
      background="#f4f6fb"
    >
      <LoginForm />
      <AuthToggleLink
        prompt="New to the platform?"
        linkLabel="Create an account"
        to="/signup"
      />
    </AuthLayout>
  )
})

export default LoginPage
