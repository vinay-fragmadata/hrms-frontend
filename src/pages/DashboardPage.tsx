import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { memo, useMemo } from 'react'

const DashboardPage = memo(function DashboardPage() {
  const cards = useMemo(
    () => [
      {
        title: 'Employees',
        body: 'Directory, org chart, and profiles will live here.',
      },
      {
        title: 'Time & attendance',
        body: 'Clock in, leave requests, and approvals — connect via RTK Query.',
      },
      {
        title: 'Payroll',
        body: 'Compensation runs and payslips — wire to your API endpoints.',
      },
    ],
    [],
  )

  return (
    <Stack spacing={2}>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 0 }}>
        Overview of your HR workspace. Use the sidebar to open Employees or Timesheet.
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        {cards.map((c) => (
          <Card key={c.title} sx={{ flex: '1 1 240px', minWidth: 220 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {c.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {c.body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
})

export default DashboardPage
