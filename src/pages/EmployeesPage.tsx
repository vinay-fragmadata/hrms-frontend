import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

const EmployeesPage = memo(function EmployeesPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Employees
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Employee directory and org structure will appear here. Connect this view to
          your HRMS API with RTK Query.
        </Typography>
      </CardContent>
    </Card>
  )
})

export default EmployeesPage
