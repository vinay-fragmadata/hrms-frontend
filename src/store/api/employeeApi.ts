import { baseApi } from '@/store/api/baseApi'
import type {
  BackendEmployeeCreateResponse,
  BackendEmployeesListResponse,
  CreateEmployeeRequest,
  Employee,
} from '@/types/employee'

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<Employee[], void>({
      query: () => ({ url: '/employees', method: 'GET' }),
      transformResponse: (raw: unknown) =>
        (raw as BackendEmployeesListResponse).data.employees,
    }),
    createEmployee: build.mutation<Employee, CreateEmployeeRequest>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) =>
        (raw as BackendEmployeeCreateResponse).data.employee,
    }),
  }),
})

export const { useGetEmployeesQuery, useCreateEmployeeMutation } = employeeApi
