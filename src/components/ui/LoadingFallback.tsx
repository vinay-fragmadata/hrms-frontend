import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { memo } from 'react'

export const LoadingFallback = memo(function LoadingFallback() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      role="status"
      aria-label="Loading"
    >
      <CircularProgress color="primary" />
    </Box>
  )
})
