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
import { useSignupMutation } from '@/store/api/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

export const SignupForm = memo(function SignupForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signup, { isLoading, isError, error }] = useSignupMutation()

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
      return `Sign up failed (${(error as { status: number }).status}). Ensure the backend is running on port 5000.`
    }
    return 'Unable to create an account. Please try again.'
  }, [isError, error])

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      try {
        const result = await signup({ email, password, fullName }).unwrap()
        dispatch(setCredentials({ token: result.token, user: result.user }))
        navigate('/dashboard', { replace: true })
      } catch {
        /* surfaced via isError */
      }
    },
    [dispatch, email, fullName, navigate, password, signup],
  )

  const handleFullNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFullName(e.target.value)
    },
    [],
  )

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    },
    [],
  )

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
    },
    [],
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={1}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        <FormTextField
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          value={fullName}
          onChange={handleFullNameChange}
          disabled={isLoading}
        />
        <FormTextField
          label="Work email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleEmailChange}
          disabled={isLoading}
        />
        <FormTextField
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={handlePasswordChange}
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </Stack>
    </form>
  )
})
