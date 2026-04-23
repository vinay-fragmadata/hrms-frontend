import { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthToggleLink } from '@/components/auth/AuthToggleLink'
import { SignupForm } from '@/components/auth/SignupForm'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

const SignupPage = memo(function SignupPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Password: 8+ characters with uppercase, lowercase, and a number (server rules)."
    >
      <SignupForm />
      <AuthToggleLink
        prompt="Already have an account?"
        linkLabel="Sign in"
        to="/login"
      />
    </AuthLayout>
  )
})

export default SignupPage
