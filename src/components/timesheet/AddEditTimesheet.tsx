import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { useGetEmployeesQuery } from '@/store/api/employeeApi'
import {
  useAddTimesheetMutation,
  useUpdateTimesheetMutation,
} from '@/store/api/timesheetApi'
import type { Employee } from '@/types/employee'
import type { Timesheet, TimesheetFormPayload, TimesheetStatus } from '@/types/timesheet'
import { TIMESHEET_STATUS_OPTIONS } from '@/types/timesheet'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

export interface AddEditTimesheetProps {
  open: boolean
  entry: Timesheet | null
  onClose: () => void
  onToast: (message: string, severity: 'success' | 'error') => void
}

type FieldErrors = Partial<
  Record<'employee' | 'task' | 'date' | 'hours' | 'status', string>
>

function validate(
  employee: Employee | null,
  task: string,
  date: string,
  hours: string,
  status: TimesheetStatus | '',
): FieldErrors {
  const e: FieldErrors = {}
  if (!employee) e.employee = 'Select an employee'
  if (!task.trim()) e.task = 'Task is required'
  if (!date) e.date = 'Date is required'
  const h = Number(hours)
  if (hours === '' || Number.isNaN(h)) e.hours = 'Enter valid hours'
  else if (h < 0 || h > 24) e.hours = 'Hours must be between 0 and 24'
  if (!status) e.status = 'Status is required'
  return e
}

export const AddEditTimesheet = memo(function AddEditTimesheet({
  open,
  entry,
  onClose,
  onToast,
}: AddEditTimesheetProps) {
  const isEdit = Boolean(entry)
  const { data: employees = [], isLoading: employeesLoading } =
    useGetEmployeesQuery()
  const [addTimesheet, { isLoading: isAdding }] = useAddTimesheetMutation()
  const [updateTimesheet, { isLoading: isUpdating }] = useUpdateTimesheetMutation()
  const submitting = isAdding || isUpdating

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [task, setTask] = useState('')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState('')
  const [status, setStatus] = useState<TimesheetStatus | ''>('')
  const [errors, setErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!open) return
    if (entry && employees.length > 0) {
      const emp = employees.find((x) => x.id === entry.employeeId) ?? null
      setEmployee(emp)
      setTask(entry.task)
      setDate(entry.date)
      setHours(String(entry.hours))
      setStatus(entry.status)
    } else if (!entry) {
      setEmployee(null)
      setTask('')
      setDate('')
      setHours('')
      setStatus('')
    }
    setErrors({})
  }, [open, entry, employees])

  const title = isEdit ? 'Edit timesheet' : 'Add timesheet'

  const handleClear = useCallback(() => {
    setEmployee(null)
    setTask('')
    setDate('')
    setHours('')
    setStatus('')
    setErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault()
      const next = validate(employee, task, date, hours, status)
      setErrors(next)
      if (Object.keys(next).length > 0 || !employee || !status) return

      const payload: TimesheetFormPayload = {
        employeeId: employee.id,
        task: task.trim(),
        date,
        hours: Number(hours),
        status,
      }

      try {
        if (isEdit && entry) {
          await updateTimesheet({ id: entry.id, body: payload }).unwrap()
          onToast('Timesheet updated successfully', 'success')
        } else {
          await addTimesheet(payload).unwrap()
          onToast('Timesheet added successfully', 'success')
        }
        onClose()
      } catch (err) {
        onToast(parseRtkQueryErrorMessage(err) ?? 'Request failed', 'error')
      }
    },
    [
      addTimesheet,
      date,
      employee,
      entry,
      hours,
      isEdit,
      onClose,
      onToast,
      status,
      task,
      updateTimesheet,
    ],
  )

  const employeeOptions = useMemo(() => employees, [employees])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={submitting ? undefined : onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 440 },
            maxWidth: '100%',
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 2 }}
        >
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2, py: 2, flex: 1, overflow: 'auto' }}>
          <Autocomplete<Employee, false, false, false>
            options={employeeOptions}
            loading={employeesLoading}
            value={employee}
            onChange={(_, v) => {
              setEmployee(v)
              setErrors((er) => ({ ...er, employee: undefined }))
            }}
            getOptionLabel={(o) =>
              `${o.firstName} ${o.lastName}`.trim() || o.email
            }
            isOptionEqualToValue={(a, b) => a.id === b.id}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee name"
                placeholder="Search or select"
                error={Boolean(errors.employee)}
                helperText={errors.employee}
                margin="normal"
              />
            )}
          />

          <TextField
            label="Task"
            value={task}
            onChange={(ev) => {
              setTask(ev.target.value)
              setErrors((er) => ({ ...er, task: undefined }))
            }}
            error={Boolean(errors.task)}
            helperText={errors.task}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            disabled={submitting}
          />

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(ev) => {
              setDate(ev.target.value)
              setErrors((er) => ({ ...er, date: undefined }))
            }}
            error={Boolean(errors.date)}
            helperText={errors.date}
            fullWidth
            margin="normal"
            disabled={submitting}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Hours"
            type="number"
            value={hours}
            onChange={(ev) => {
              setHours(ev.target.value)
              setErrors((er) => ({ ...er, hours: undefined }))
            }}
            error={Boolean(errors.hours)}
            helperText={errors.hours}
            fullWidth
            margin="normal"
            disabled={submitting}
            inputProps={{ min: 0, max: 24, step: 0.25 }}
          />

          <FormControl fullWidth margin="normal" error={Boolean(errors.status)}>
            <InputLabel id="timesheet-status-label">Status</InputLabel>
            <Select
              labelId="timesheet-status-label"
              label="Status"
              value={status}
              onChange={(ev) => {
                setStatus(ev.target.value as TimesheetStatus)
                setErrors((er) => ({ ...er, status: undefined }))
              }}
              disabled={submitting}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select status</em>
              </MenuItem>
              {TIMESHEET_STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
            {errors.status ? (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.status}
              </Typography>
            ) : null}
          </FormControl>
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ p: 2 }}>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={handleClear}
            disabled={submitting}
          >
            Clear
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update' : 'Add'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
})
