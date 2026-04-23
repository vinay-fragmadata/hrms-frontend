import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { memo } from 'react'
import { Link as RouterLink } from 'react-router-dom'

export interface AuthToggleLinkProps {
  prompt: string
  linkLabel: string
  to: string
}

export const AuthToggleLink = memo(function AuthToggleLink({
  prompt,
  linkLabel,
  to,
}: AuthToggleLinkProps) {
  return (
    <Box mt={2} textAlign="center">
      <Typography variant="body2" color="text.secondary" component="span">
        {prompt}{' '}
      </Typography>
      <Link component={RouterLink} to={to} variant="body2" fontWeight={600}>
        {linkLabel}
      </Link>
    </Box>
  )
})
