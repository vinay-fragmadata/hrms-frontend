import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'
import { setCredentials } from '@/store/slices/authSlice'

type LoginMutationState = {
  isLoading: boolean
  isError: boolean
  error?: unknown
}

const mockNavigate = jest.fn()
const mockDispatch = jest.fn()
const mockUseLoginMutation = jest.fn()
const mockLogin = jest.fn()

let mutationState: LoginMutationState = {
  isLoading: false,
  isError: false,
  error: undefined,
}

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

jest.mock('@/app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('@/store/api/authApi', () => ({
  useLoginMutation: () => mockUseLoginMutation(),
}))

jest.mock('@/store/slices/authSlice', () => ({
  setCredentials: jest.fn((payload: unknown) => ({
    type: 'auth/setCredentials',
    payload,
  })),
}))

function renderLoginForm() {
  return {
    user: userEvent.setup(),
    ...render(<LoginForm />),
  }
}

function submitForm() {
  const button = screen.getByRole('button', { name: /sign in/i })
  const form = button.closest('form')
  if (!form) {
    throw new Error('Login form not found')
  }
  fireEvent.submit(form)
}

beforeEach(() => {
  mutationState = {
    isLoading: false,
    isError: false,
    error: undefined,
  }
  mockNavigate.mockReset()
  mockDispatch.mockReset()
  mockUseLoginMutation.mockReset()
  mockLogin.mockReset()
  ;(setCredentials as jest.Mock).mockClear()

  mockUseLoginMutation.mockImplementation(() => [mockLogin, mutationState])
})

describe('LoginForm', () => {
  it('renders email input, password input, and login button', () => {
    renderLoginForm()

    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates empty fields and invalid email', async () => {
    const { user } = renderLoginForm()

    submitForm()

    expect(screen.getByText('Work email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/work email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), 'secret123')

    submitForm()

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('toggles submit button disabled/enabled based on input values', async () => {
    const { user } = renderLoginForm()
    const button = screen.getByRole('button', { name: /sign in/i })

    expect(button).toBeDisabled()

    await user.type(screen.getByLabelText(/work email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    expect(button).toBeDisabled()

    await user.clear(screen.getByLabelText(/work email/i))
    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    expect(button).toBeEnabled()
  })

  it('calls login API with correct payload', async () => {
    const { user } = renderLoginForm()

    const response = {
      token: 'token-123',
      user: {
        id: '1',
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'Admin',
      },
    }

    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(response),
    })

    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state when API call is in progress', () => {
    mutationState = {
      isLoading: true,
      isError: false,
      error: undefined,
    }
    mockUseLoginMutation.mockImplementation(() => [mockLogin, mutationState])

    renderLoginForm()

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    expect(screen.getByLabelText(/work email/i)).toBeDisabled()
    expect(screen.getByLabelText(/password/i)).toBeDisabled()
  })

  it('displays error message when login API fails', () => {
    mutationState = {
      isLoading: false,
      isError: true,
      error: { status: 401 },
    }
    mockUseLoginMutation.mockImplementation(() => [mockLogin, mutationState])

    renderLoginForm()

    expect(
      screen.getByText(
        'Sign in failed (401). Ensure the backend is running on port 5000.',
      ),
    ).toBeInTheDocument()
  })

  it('shows backend validation message from API error response', () => {
    mutationState = {
      isLoading: false,
      isError: true,
      error: {
        status: 400,
        data: {
          message: 'Invalid credentials provided.',
        },
      },
    }
    mockUseLoginMutation.mockImplementation(() => [mockLogin, mutationState])

    renderLoginForm()

    expect(screen.getByText('Invalid credentials provided.')).toBeInTheDocument()
  })

  it('shows fallback error when API returns an unknown error shape', () => {
    mutationState = {
      isLoading: false,
      isError: true,
      error: { data: { foo: 'bar' } },
    }
    mockUseLoginMutation.mockImplementation(() => [mockLogin, mutationState])

    renderLoginForm()

    expect(
      screen.getByText('Unable to sign in. Please try again.'),
    ).toBeInTheDocument()
  })

  it('dispatches credentials and redirects after successful login', async () => {
    const { user } = renderLoginForm()

    const response = {
      token: 'token-123',
      user: {
        id: '1',
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'Admin',
      },
    }

    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(response),
    })

    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(setCredentials).toHaveBeenCalledWith({
        token: response.token,
        user: response.user,
      })
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'auth/setCredentials',
        payload: {
          token: response.token,
          user: response.user,
        },
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('prevents multiple API calls on rapid multiple clicks', async () => {
    const { user } = renderLoginForm()

    mockLogin.mockReturnValue({
      unwrap: jest.fn(
        () => new Promise(() => {}),
      ) as unknown as () => Promise<unknown>,
    })

    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    const button = screen.getByRole('button', { name: /sign in/i })
    await user.click(button)
    fireEvent.click(button)

    expect(mockLogin).toHaveBeenCalledTimes(1)
  })

  it('does not dispatch credentials or redirect when login promise rejects', async () => {
    const { user } = renderLoginForm()

    const unwrap = jest.fn().mockRejectedValue(new Error('Request failed'))
    mockLogin.mockReturnValue({ unwrap })

    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1)
      expect(unwrap).toHaveBeenCalledTimes(1)
    })

    expect(setCredentials).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('allows retry after a failed login API attempt', async () => {
    const { user } = renderLoginForm()

    const unwrap = jest
      .fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce({
        token: 'token-123',
        user: {
          id: '1',
          email: 'john@example.com',
          fullName: 'John Doe',
          role: 'Admin',
        },
      })

    mockLogin.mockReturnValue({ unwrap })

    await user.type(screen.getByLabelText(/work email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    const button = screen.getByRole('button', { name: /sign in/i })
    await user.click(button)
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1)
    })

    await user.click(button)
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(2)
    })
  })
})
