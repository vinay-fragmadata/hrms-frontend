import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import {
  type ChangeEvent,
  type FormEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { FormTextField } from '@/components/ui/FormTextField'
import { useLoginMutation } from '@/store/api/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LoginForm = memo(function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [login, { isLoading, isError, error }] = useLoginMutation()

  const errorMessage = useMemo(() => {
    if (!isError) return null
    const parsed = parseRtkQueryErrorMessage(error)
    if (parsed) return parsed
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof (error as { status: unknown }).status === 'number'
    ) {
      return `Sign in failed (${(error as { status: number }).status}). Ensure the backend is running on port 5000.`
    }
    return 'Unable to sign in. Please try again.'
  }, [isError, error])

  const validateForm = useCallback(
    (nextEmail: string, nextPassword: string) => {
      let hasError = false

      if (!nextEmail.trim()) {
        setEmailError('Work email is required.')
        hasError = true
      } else if (!emailRegex.test(nextEmail)) {
        setEmailError('Enter a valid email address.')
        hasError = true
      } else {
        setEmailError(null)
      }

      if (!nextPassword.trim()) {
        setPasswordError('Password is required.')
        hasError = true
      } else {
        setPasswordError(null)
      }

      return !hasError
    },
    [],
  )

  const canSubmit = useMemo(() => {
    const hasValues = email.trim().length > 0 && password.trim().length > 0
    const isEmailValid = emailRegex.test(email)
    return hasValues && isEmailValid
  }, [email, password])

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (isSubmitting || isLoading) return
      if (!validateForm(email, password)) return

      setIsSubmitting(true)
      try {
        const result = await login({ email, password }).unwrap()
        dispatch(setCredentials({ token: result.token, user: result.user }))
        navigate('/dashboard', { replace: true })
      } catch {
        /* surfaced via isError */
      } finally {
        setIsSubmitting(false)
      }
    },
    [dispatch, email, isLoading, isSubmitting, login, navigate, password, validateForm],
  )

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nextEmail = e.target.value
      setEmail(nextEmail)

      if (emailError) {
        if (!nextEmail.trim()) {
          setEmailError('Work email is required.')
        } else if (!emailRegex.test(nextEmail)) {
          setEmailError('Enter a valid email address.')
        } else {
          setEmailError(null)
        }
      }
    },
    [emailError],
  )

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nextPassword = e.target.value
      setPassword(nextPassword)

      if (passwordError) {
        if (!nextPassword.trim()) {
          setPasswordError('Password is required.')
        } else {
          setPasswordError(null)
        }
      }
    },
    [passwordError],
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={1}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        <FormTextField
          label="Work email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleEmailChange}
          disabled={isLoading || isSubmitting}
          error={Boolean(emailError)}
          helperText={emailError}
        />
        <FormTextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={handlePasswordChange}
          disabled={isLoading || isSubmitting}
          error={Boolean(passwordError)}
          helperText={passwordError}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading || isSubmitting || !canSubmit}
          sx={{ mt: 1, width: '50%', alignSelf: 'center' }}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  )
})
