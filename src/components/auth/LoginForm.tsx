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

export const LoginForm = memo(function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      try {
        const result = await login({ email, password }).unwrap()
        dispatch(setCredentials({ token: result.token, user: result.user }))
        navigate('/dashboard', { replace: true })
      } catch {
        /* surfaced via isError */
      }
    },
    [dispatch, email, login, navigate, password],
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
          autoComplete="current-password"
          required
          value={password}
          onChange={handlePasswordChange}
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          sx={{ mt: 1, width: '50%', alignSelf: 'center' }}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  )
})
