export const TIMESHEET_STATUS_OPTIONS = [
  'Pending',
  'Approved',
  'Blocked',
  'Hold',
  'Completed',
  'In progress',
] as const

export type TimesheetStatus = (typeof TIMESHEET_STATUS_OPTIONS)[number]

export interface Timesheet {
  id: string
  employeeId: string
  employeeName: string
  task: string
  date: string
  hours: number
  status: TimesheetStatus
}

export interface TimesheetFormPayload {
  employeeId: string
  task: string
  date: string
  hours: number
  status: TimesheetStatus
}

export interface TimesheetsListResponse {
  success: boolean
  data: {
    timesheets: Timesheet[]
  }
}

export interface TimesheetSingleResponse {
  success: boolean
  message: string
  data: {
    timesheet: Timesheet
  }
}
