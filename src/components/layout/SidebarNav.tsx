import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { memo, useMemo, type ReactNode } from 'react'
import { NavLink, useMatch } from 'react-router-dom'

const DRAWER_WIDTH = 260

export const SIDEBAR_WIDTH = DRAWER_WIDTH

interface NavItemConfig {
  to: string
  label: string
  icon: ReactNode
}

function NavItem({ to, label, icon }: NavItemConfig) {
  const match = useMatch({ path: to, end: true })

  return (
    <ListItemButton
      component={NavLink}
      to={to}
      selected={Boolean(match)}
      sx={{
        py: 1.125,
        '&.Mui-selected': {
          borderRadius: '10px',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      />
    </ListItemButton>
  )
}

export const SidebarNav = memo(function SidebarNav() {
  const menuItems = useMemo<NavItemConfig[]>(
    () => [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlinedIcon fontSize="small" />,
      },
      {
        to: '/employees',
        label: 'Employees',
        icon: <GroupsOutlinedIcon fontSize="small" />,
      },
      {
        to: '/timesheet',
        label: 'Timesheet',
        icon: <AccessTimeOutlinedIcon fontSize="small" />,
      },
    ],
    [],
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: 'primary.contrastText',
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: 1,
              fontFamily: 'inherit',
            }}
          >
            H
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          HRMS
        </Typography>
      </Box>

      <List
        component="nav"
        disablePadding
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            sx={{
              bgcolor: 'background.paper',
              color: 'text.secondary',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              lineHeight: 2.5,
              px: 2.5,
              pt: 2.5,
              pb: 0.5,
            }}
          >
            MENU
          </ListSubheader>
        }
      >
        {menuItems.map((item) => (
          <Box key={item.to} sx={{ px: 1, py: 0.25 }}>
            <NavItem {...item} />
          </Box>
        ))}
      </List>
    </Drawer>
  )
})
