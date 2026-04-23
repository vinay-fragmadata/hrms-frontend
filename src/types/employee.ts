export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  department: string
  role: string
}

/** Body for POST /employees and PATCH /employees/:id */
export interface EmployeeFormPayload {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  department: string
  role: string
}

export interface EmployeesListResponse {
  success: boolean
  data: {
    employees: Employee[]
  }
}

export interface EmployeeSingleResponse {
  success: boolean
  message: string
  data: {
    employee: Employee
  }
}
