import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { memo, type ReactNode } from 'react'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  background?: string
  children: ReactNode
}

export const AuthLayout = memo(function AuthLayout({
  title,
  subtitle,
  background,
  children,
}: AuthLayoutProps) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={4}
      px={2}
      sx={{
        background:
          background ??
          ((theme) =>
            `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 42%, ${theme.palette.secondary.dark} 100%)`),
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2} mb={3}>
            <Typography variant="h4" component="h1" color="primary">
              HRMS-{' '}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Solution of all problem
              </Typography>
            </Typography>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
          {children}
        </Paper>
      </Container>
    </Box>
  )
})
