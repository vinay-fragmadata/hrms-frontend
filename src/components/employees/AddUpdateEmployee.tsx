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
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { FormTextField } from '@/components/ui/FormTextField'
import {
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/store/api/employeesApi'
import type { Employee, EmployeeFormPayload } from '@/types/employee'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const emptyForm: EmployeeFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  department: '',
  role: '',
}

type FieldErrors = Partial<Record<keyof EmployeeFormPayload, string>>

function validateForm(values: EmployeeFormPayload): FieldErrors {
  const e: FieldErrors = {}
  if (!values.firstName.trim()) e.firstName = 'First name is required'
  if (!values.lastName.trim()) e.lastName = 'Last name is required'
  if (!values.email.trim()) {
    e.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    e.email = 'Enter a valid email'
  }
  if (!values.contactNumber.trim()) {
    e.contactNumber = 'Contact number is required'
  } else if (values.contactNumber.trim().length < 5) {
    e.contactNumber = 'Contact number is too short'
  } else if (values.contactNumber.trim().length > 20) {
    e.contactNumber = 'Contact number must be at most 20 characters'
  }
  if (!values.department.trim()) e.department = 'Department is required'
  if (!values.role.trim()) e.role = 'Role is required'
  return e
}

export interface AddUpdateEmployeeProps {
  open: boolean
  employee: Employee | null
  onClose: () => void
  onToast: (message: string, severity: 'success' | 'error') => void
}

export const AddUpdateEmployee = memo(function AddUpdateEmployee({
  open,
  employee,
  onClose,
  onToast,
}: AddUpdateEmployeeProps) {
  const isEdit = Boolean(employee)
  const [values, setValues] = useState<EmployeeFormPayload>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})

  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation()
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()
  const submitting = isAdding || isUpdating

  useEffect(() => {
    if (!open) return
    if (employee) {
      setValues({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        contactNumber: employee.contactNumber,
        department: employee.department,
        role: employee.role,
      })
    } else {
      setValues(emptyForm)
    }
    setErrors({})
  }, [open, employee])

  const title = useMemo(
    () => (isEdit ? 'Edit employee' : 'Add employee'),
    [isEdit],
  )

  const submitLabel = isEdit ? 'Update' : 'Add'

  const handleChange = useCallback(
    (field: keyof EmployeeFormPayload) => (ev: ChangeEvent<HTMLInputElement>) => {
        setValues((v) => ({ ...v, [field]: ev.target.value }))
        setErrors((err) => ({ ...err, [field]: undefined }))
      },
    [],
  )

  const handleClear = useCallback(() => {
    setValues(emptyForm)
    setErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault()
      const nextErrors = validateForm(values)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return

      const payload: EmployeeFormPayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        contactNumber: values.contactNumber.trim(),
        department: values.department.trim(),
        role: values.role.trim(),
      }

      try {
        if (isEdit && employee) {
          await updateEmployee({
            id: employee.id,
            body: payload,
          }).unwrap()
          onToast('Employee updated successfully', 'success')
        } else {
          await addEmployee(payload).unwrap()
          onToast('Employee added successfully', 'success')
        }
        onClose()
      } catch (err) {
        onToast(parseRtkQueryErrorMessage(err) ?? 'Something went wrong', 'error')
      }
    },
    [
      addEmployee,
      employee,
      isEdit,
      onClose,
      onToast,
      updateEmployee,
      values,
    ],
  )

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={submitting ? undefined : onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
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
          <Typography variant="h6" component="h2" fontWeight={700}>
            {title}
          </Typography>
          <IconButton
            aria-label="Close drawer"
            onClick={onClose}
            disabled={submitting}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={1} sx={{ px: 2, py: 2, flex: 1, overflow: 'auto' }}>
          <FormTextField
            label="First name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange('firstName')}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            disabled={submitting}
            autoComplete="given-name"
          />
          <FormTextField
            label="Last name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange('lastName')}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            disabled={submitting}
            autoComplete="family-name"
          />
          <FormTextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={submitting}
            autoComplete="email"
          />
          <FormTextField
            label="Contact number"
            name="contactNumber"
            value={values.contactNumber}
            onChange={handleChange('contactNumber')}
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
            disabled={submitting}
            autoComplete="tel"
          />
          <FormTextField
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange('department')}
            error={Boolean(errors.department)}
            helperText={errors.department}
            disabled={submitting}
          />
          <FormTextField
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange('role')}
            error={Boolean(errors.role)}
            helperText={errors.role}
            disabled={submitting}
          />
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
            {submitting ? 'Saving…' : submitLabel}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
})
