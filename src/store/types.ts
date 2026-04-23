import type { AuthState } from '@/store/slices/authSlice'

/** State shape used by RTK Query `prepareHeaders` (avoids importing the store). */
export type WithAuthState = { auth: AuthState }
