import type { AuthUser } from '@/types/auth'

const STORAGE_KEY = 'hrms_auth'

export interface SessionAuthState {
  token: string | null
  user: AuthUser | null
}

export function loadAuthFromSession(): SessionAuthState {
  const empty: SessionAuthState = { token: null, user: null }
  if (typeof sessionStorage === 'undefined') return empty
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const data = JSON.parse(raw) as {
      token?: unknown
      user?: unknown
    }
    if (typeof data.token !== 'string' || !data.user || typeof data.user !== 'object') {
      return empty
    }
    const u = data.user as Record<string, unknown>
    if (
      typeof u.id !== 'string' ||
      typeof u.email !== 'string' ||
      typeof u.fullName !== 'string'
    ) {
      return empty
    }
    const user: AuthUser = {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: typeof u.role === 'string' ? u.role : undefined,
    }
    return { token: data.token, user }
  } catch {
    return empty
  }
}

export function saveAuthSession(payload: { token: string; user: AuthUser }) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuthSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}
