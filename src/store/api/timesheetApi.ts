import { baseApi } from '@/store/api/baseApi'
import type {
  Timesheet,
  TimesheetFormPayload,
  TimesheetSingleResponse,
  TimesheetsListResponse,
} from '@/types/timesheet'

export const timesheetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheets: build.query<Timesheet[], void>({
      query: () => ({ url: '/timesheets' }),
      transformResponse: (raw: unknown) => {
        const res = raw as TimesheetsListResponse
        return res.data?.timesheets ?? []
      },
    }),
    addTimesheet: build.mutation<Timesheet, TimesheetFormPayload>({
      query: (body) => ({
        url: '/timesheets',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as TimesheetSingleResponse
        return r.data.timesheet
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            timesheetApi.util.updateQueryData('getTimesheets', undefined, (draft) => {
              draft.unshift(data)
            }),
          )
        } catch {
          /* no cache update on failure */
        }
      },
    }),
    updateTimesheet: build.mutation<
      Timesheet,
      { id: string; body: TimesheetFormPayload }
    >({
      query: ({ id, body }) => ({
        url: `/timesheets/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as TimesheetSingleResponse
        return r.data.timesheet
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            timesheetApi.util.updateQueryData('getTimesheets', undefined, (draft) => {
              const i = draft.findIndex((t) => t.id === data.id)
              if (i !== -1) draft[i] = data
            }),
          )
        } catch {
          /* unchanged on error */
        }
      },
    }),
    deleteTimesheet: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/timesheets/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as { message?: string }
        return { message: r.message ?? 'Deleted' }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            timesheetApi.util.updateQueryData('getTimesheets', undefined, (draft) => {
              const i = draft.findIndex((t) => t.id === id)
              if (i !== -1) draft.splice(i, 1)
            }),
          )
        } catch {
          /* keep row if delete failed */
        }
      },
    }),
  }),
})

export const {
  useGetTimesheetsQuery,
  useAddTimesheetMutation,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
} = timesheetApi
