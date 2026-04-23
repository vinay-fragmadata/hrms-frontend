import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AddEditEmployee } from '@/components/employee/AddEditEmployee'
import { useGetEmployeesQuery } from '@/store/api/employeeApi'
import type { Employee } from '@/types/employee'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const EmployeesPage = memo(function EmployeesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const { data, isLoading, isError, error } = useGetEmployeesQuery()

  useEffect(() => {
    if (data) {
      setEmployees(data)
    }
  }, [data])

  const errorMessage = useMemo(() => {
    if (!isError) return null
    const parsed = parseRtkQueryErrorMessage(error)
    if (parsed) return parsed
    return 'Unable to load employees right now.'
  }, [error, isError])

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  const handleEmployeeSaved = useCallback((newEmployee: Employee) => {
    // Keep UI in sync after save without calling the list endpoint again.
    setEmployees((prev) => [newEmployee, ...prev])
  }, [])

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6">Employees</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage staff and basic employee details.
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleOpenDrawer}>
            Add Staff
          </Button>
        </Stack>

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : employees.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No employees found.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.contactNumber}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AddEditEmployee
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSaved={handleEmployeeSaved}
      />
    </Card>
  )
})

export default EmployeesPage
