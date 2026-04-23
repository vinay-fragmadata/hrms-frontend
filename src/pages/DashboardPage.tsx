import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

/**
 * Placeholder for analytics, KPIs, and charts. Employee directory lives on Employees.
 */
const DashboardPage = memo(function DashboardPage() {
  return (
    <Box
      sx={{
        minHeight: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        borderStyle: 'dashed',
        bgcolor: 'background.paper',
        px: 3,
        py: 6,
      }}
    >
      <Typography variant="body1" color="text.secondary" textAlign="center">
        Analytics and graphs will be added here. Use the sidebar to open{' '}
        <strong>Employees</strong> for the directory.
      </Typography>
    </Box>
  )
})

export default DashboardPage
