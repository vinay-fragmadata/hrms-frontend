export interface AuthUser {
  id: string
  email: string
  fullName: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
}

/** Successful auth response from `hrms-backend` (`POST /api/v1/auth/login|signup`). */
export interface BackendAuthSuccessBody {
  success: true
  message: string
  data: {
    token: string
    user: {
      _id: string
      fullName: string
      email: string
      role?: string
    }
  }
}
