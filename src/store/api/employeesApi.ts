import { baseApi } from '@/store/api/baseApi'
import type {
  Employee,
  EmployeeFormPayload,
  EmployeeSingleResponse,
  EmployeesListResponse,
} from '@/types/employee'

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<Employee[], void>({
      query: () => ({ url: '/employees' }),
      transformResponse: (raw: unknown) => {
        const res = raw as EmployeesListResponse
        return res.data?.employees ?? []
      },
      providesTags: ['Employee'],
    }),
    addEmployee: build.mutation<Employee, EmployeeFormPayload>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as EmployeeSingleResponse
        return r.data.employee
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            employeesApi.util.updateQueryData('getEmployees', undefined, (draft) => {
              draft.unshift(data)
            }),
          )
        } catch {
          /* only update cache after confirmed server success */
        }
      },
    }),
    updateEmployee: build.mutation<
      Employee,
      { id: string; body: EmployeeFormPayload }
    >({
      query: ({ id, body }) => ({
        url: `/employees/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as EmployeeSingleResponse
        return r.data.employee
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            employeesApi.util.updateQueryData('getEmployees', undefined, (draft) => {
              const i = draft.findIndex((e) => e.id === data.id)
              if (i !== -1) draft[i] = data
            }),
          )
        } catch {
          /* cache unchanged on failure */
        }
      },
    }),
    deleteEmployee: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as { success?: boolean; message?: string }
        return { message: r.message ?? 'Employee deleted' }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            employeesApi.util.updateQueryData('getEmployees', undefined, (draft) => {
              const i = draft.findIndex((e) => e.id === id)
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
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi
