import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { memo, useCallback, useMemo, useState } from 'react'
import { AddUpdateEmployee } from '@/components/employees/AddUpdateEmployee'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from '@/store/api/employeesApi'
import type { Employee } from '@/types/employee'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const EmployeesPage = memo(function EmployeesPage() {
  const { data: employees = [], isLoading, isError, error, refetch } =
    useGetEmployeesQuery()
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation()

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [employeeDrawer, setEmployeeDrawer] = useState<{
    open: boolean
    employee: Employee | null
  }>({ open: false, employee: null })

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const listError = useMemo(() => {
    if (!isError) return null
    return parseRtkQueryErrorMessage(error) ?? 'Could not load employees.'
  }, [isError, error])

  const closeDeleteDialog = useCallback(() => {
    if (!isDeleting) setDeleteTarget(null)
  }, [isDeleting])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      const result = await deleteEmployee(deleteTarget.id).unwrap()
      setDeleteTarget(null)
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success',
      })
    } catch (e) {
      setSnackbar({
        open: true,
        message: parseRtkQueryErrorMessage(e) ?? 'Delete failed.',
        severity: 'error',
      })
    }
  }, [deleteEmployee, deleteTarget])

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const openAddEmployee = useCallback(() => {
    setEmployeeDrawer({ open: true, employee: null })
  }, [])

  const openEditEmployee = useCallback((row: Employee) => {
    setEmployeeDrawer({ open: true, employee: row })
  }, [])

  const closeEmployeeDrawer = useCallback(() => {
    setEmployeeDrawer({ open: false, employee: null })
  }, [])

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setSnackbar({ open: true, message, severity })
    },
    [],
  )

  return (
    <Stack spacing={2}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
        Employee directory — data from the HRMS API.
      </Typography>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddEmployee}
        >
          Add Employee
        </Button>
      </Stack>

      {listError ? (
        <Alert severity="error">
          {listError}
          <Box component="span" sx={{ display: 'block', mt: 1 }}>
            <Typography
              component="button"
              type="button"
              variant="body2"
              onClick={() => refetch()}
              sx={{
                border: 0,
                p: 0,
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'inherit',
              }}
            >
              Retry
            </Typography>
          </Box>
        </Alert>
      ) : null}

      <TableContainer component={Paper} elevation={1}>
        <Table size="medium" aria-label="Employees table">
          <TableHead>
            <TableRow>
              <TableCell width={72}>Sr. no.</TableCell>
              <TableCell>Full name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right" width={140}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">Loading employees…</Typography>
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">No employees found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {`${row.firstName} ${row.lastName}`.trim()}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.contactNumber}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Preview (coming soon)">
                      <span>
                        <IconButton
                          size="small"
                          aria-label="Preview employee"
                          disabled
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Edit employee">
                      <IconButton
                        size="small"
                        aria-label="Edit employee"
                        onClick={() => openEditEmployee(row)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete employee">
                      <IconButton
                        size="small"
                        aria-label="Delete employee"
                        onClick={() => setDeleteTarget(row)}
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddUpdateEmployee
        open={employeeDrawer.open}
        employee={employeeDrawer.employee}
        onClose={closeEmployeeDrawer}
        onToast={showToast}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete employee?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.firstName} ${deleteTarget.lastName} (${deleteTarget.email}) from the directory.`
            : ''
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        confirmLoading={isDeleting}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
})

export default EmployeesPage
