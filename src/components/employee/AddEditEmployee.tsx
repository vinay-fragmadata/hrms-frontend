import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { FormTextField } from '@/components/ui/FormTextField'
import { useCreateEmployeeMutation } from '@/store/api/employeeApi'
import type { CreateEmployeeRequest, Employee } from '@/types/employee'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const empty: CreateEmployeeRequest = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  department: '',
  role: '',
}

type Errors = Partial<Record<keyof CreateEmployeeRequest, string>>

function validate(v: CreateEmployeeRequest): Errors {
  const e: Errors = {}
  if (!v.firstName.trim()) e.firstName = 'Required'
  if (!v.lastName.trim()) e.lastName = 'Required'
  if (!v.email.trim()) e.email = 'Required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Invalid email'
  if (!v.contactNumber.trim()) e.contactNumber = 'Required'
  if (!v.department.trim()) e.department = 'Required'
  if (!v.role.trim()) e.role = 'Required'
  return e
}

export interface AddEditEmployeeProps {
  open: boolean
  onClose: () => void
  onSaved: (employee: Employee) => void
}

export const AddEditEmployee = memo(function AddEditEmployee({
  open,
  onClose,
  onSaved,
}: AddEditEmployeeProps) {
  const [values, setValues] = useState<CreateEmployeeRequest>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation()

  useEffect(() => {
    if (open) {
      setValues(empty)
      setErrors({})
    }
  }, [open])

  const onChange =
    (field: keyof CreateEmployeeRequest) =>
    (ev: ChangeEvent<HTMLInputElement>) => {
      setValues((s) => ({ ...s, [field]: ev.target.value }))
      setErrors((er) => ({ ...er, [field]: undefined }))
    }

  const handleClear = useCallback(() => {
    setValues(empty)
    setErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault()
      const payload: CreateEmployeeRequest = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        contactNumber: values.contactNumber.trim(),
        department: values.department.trim(),
        role: values.role.trim(),
      }
      const next = validate(payload)
      setErrors(next)
      if (Object.keys(next).length > 0) return
      try {
        const employee = await createEmployee(payload).unwrap()
        onSaved(employee)
        onClose()
      } catch (err) {
        setErrors({
          email: parseRtkQueryErrorMessage(err) ?? 'Could not save employee',
        })
      }
    },
    [createEmployee, onClose, onSaved, values],
  )

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={isLoading ? undefined : onClose}
      slotProps={{
        paper: { sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' } },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Add staff
          </Typography>
          <IconButton aria-label="Close" onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <FormTextField
            label="First name"
            value={values.firstName}
            onChange={onChange('firstName')}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            disabled={isLoading}
          />
          <FormTextField
            label="Last name"
            value={values.lastName}
            onChange={onChange('lastName')}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            disabled={isLoading}
          />
          <FormTextField
            label="Email"
            type="email"
            value={values.email}
            onChange={onChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={isLoading}
          />
          <FormTextField
            label="Contact number"
            value={values.contactNumber}
            onChange={onChange('contactNumber')}
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
            disabled={isLoading}
          />
          <FormTextField
            label="Department"
            value={values.department}
            onChange={onChange('department')}
            error={Boolean(errors.department)}
            helperText={errors.department}
            disabled={isLoading}
          />
          <FormTextField
            label="Role"
            value={values.role}
            onChange={onChange('role')}
            error={Boolean(errors.role)}
            helperText={errors.role}
            disabled={isLoading}
          />
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ p: 2 }}>
          <Button type="button" variant="outlined" onClick={handleClear} disabled={isLoading}>
            Clear
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving…' : 'Add'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
})
