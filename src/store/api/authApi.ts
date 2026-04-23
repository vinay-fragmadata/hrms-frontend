import { baseApi } from '@/store/api/baseApi'
import type {
  AuthResponse,
  BackendAuthSuccessBody,
  LoginRequest,
  SignupRequest,
} from '@/types/auth'

function mapAuthResponse(res: BackendAuthSuccessBody): AuthResponse {
  const { user, token } = res.data
  return {
    token,
    user: {
      id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) =>
        mapAuthResponse(raw as BackendAuthSuccessBody),
    }),
    signup: build.mutation<AuthResponse, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) =>
        mapAuthResponse(raw as BackendAuthSuccessBody),
    }),
  }),
})

export const { useLoginMutation, useSignupMutation } = authApi
