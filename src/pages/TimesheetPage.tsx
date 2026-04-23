import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

const TimesheetPage = memo(function TimesheetPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Timesheet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Time entries, approvals, and reports will live here. Wire endpoints when your
          backend is ready.
        </Typography>
      </CardContent>
    </Card>
  )
})

export default TimesheetPage
