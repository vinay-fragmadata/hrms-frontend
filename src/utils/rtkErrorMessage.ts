/** Parses RTK Query / fetchBaseQuery error bodies from the HRMS backend. */
export function parseRtkQueryErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object' || !('data' in error)) return null
  const data = (error as { data: unknown }).data
  if (!data || typeof data !== 'object') return null
  const d = data as { message?: unknown; errors?: unknown }

  if (Array.isArray(d.errors) && d.errors.length > 0) {
    const first = d.errors[0]
    if (
      first &&
      typeof first === 'object' &&
      first !== null &&
      'message' in first &&
      typeof (first as { message: unknown }).message === 'string'
    ) {
      return (first as { message: string }).message
    }
  }

  if (typeof d.message === 'string' && d.message) return d.message
  return null
}
