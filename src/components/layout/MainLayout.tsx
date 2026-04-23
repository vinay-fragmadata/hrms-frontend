import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { memo, useMemo, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectAuthUser } from '@/store/slices/authSlice'
import { SIDEBAR_WIDTH, SidebarNav } from '@/components/layout/SidebarNav'

const pathTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/timesheet': 'Timesheet',
}

export const MainLayout = memo(function MainLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector(selectAuthUser)

  const pageTitle = useMemo(
    () => pathTitles[location.pathname] ?? 'HRMS',
    [location.pathname],
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarNav />
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            width: '100%',
            ml: 0,
          }}
        >
          <Toolbar sx={{ gap: 2, minHeight: { xs: 64, sm: 70 } }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {pageTitle}
            </Typography>
            {user ? (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            ) : null}
            <Button variant="outlined" color="inherit" size="small" onClick={handleLogout}>
              Log out
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            bgcolor: 'background.default',
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  )
})
