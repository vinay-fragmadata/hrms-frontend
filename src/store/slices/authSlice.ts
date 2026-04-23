import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/types/auth'
import { loadAuthFromSession } from '@/utils/authSession'

export interface AuthState {
  token: string | null
  user: AuthUser | null
}

/** Minimal slice shape for selectors; compatible with full `RootState`. */
type WithAuth = { auth: AuthState }

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromSession() as AuthState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout: (state) => {
      state.token = null
      state.user = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export const selectAuthToken = (state: WithAuth) => state.auth.token
export const selectAuthUser = (state: WithAuth) => state.auth.user
export const selectIsAuthenticated = (state: WithAuth) => Boolean(state.auth.token)

export default authSlice.reducer
