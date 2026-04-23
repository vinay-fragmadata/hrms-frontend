export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  department: string
  role: string
}

export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  department: string
  role: string
}

export interface BackendEmployeesListResponse {
  success: true
  data: {
    employees: Employee[]
  }
}

export interface BackendEmployeeCreateResponse {
  success: true
  message: string
  data: {
    employee: Employee
  }
}
