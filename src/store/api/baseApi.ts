import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { WithAuthState } from '@/store/types'

/** Matches `hrms-backend`: `app.use('/api/v1', routes)` on port 5000 by default. */
const defaultApiBase = 'http://localhost:5000/api/v1'

const baseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? defaultApiBase

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as WithAuthState).auth.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Employee'],
  endpoints: () => ({}),
})
