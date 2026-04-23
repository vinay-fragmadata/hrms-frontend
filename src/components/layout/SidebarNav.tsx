import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { memo, useMemo, type ReactNode } from 'react'
import { NavLink, useMatch } from 'react-router-dom'

export const SIDEBAR_EXPANDED_WIDTH = 200
export const SIDEBAR_COLLAPSED_WIDTH = 72

export function getSidebarWidth(collapsed: boolean) {
  return collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
}

export interface SidebarNavProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

interface NavItemConfig {
  to: string
  label: string
  icon: ReactNode
}

function NavItem({
  to,
  label,
  icon,
  collapsed,
}: NavItemConfig & { collapsed: boolean }) {
  const match = useMatch({ path: to, end: true })

  const button = (
    <ListItemButton
      component={NavLink}
      to={to}
      selected={Boolean(match)}
      sx={{
        py: 1.125,
        px: collapsed ? 1 : 2,
        justifyContent: collapsed ? 'center' : 'flex-start',
        '&.Mui-selected': {
          borderRadius: '10px',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 40,
          justifyContent: 'center',
          mr: collapsed ? 0 : undefined,
        }}
      >
        {icon}
      </ListItemIcon>
      {!collapsed ? (
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        />
      ) : null}
    </ListItemButton>
  )

  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        <span style={{ display: 'block' }}>{button}</span>
      </Tooltip>
    )
  }

  return button
}

export const SidebarNav = memo(function SidebarNav({
  collapsed,
  onToggleCollapse,
}: SidebarNavProps) {
  const width = getSidebarWidth(collapsed)

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
        width,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          px: collapsed ? 1 : 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 64,
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
            }}
          >
            H
          </Typography>
        </Box>
        {!collapsed ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'text.primary',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            HRMS
          </Typography>
        ) : null}
      </Box>

      <List
        component="nav"
        disablePadding
        sx={{ flex: 1, py: 1 }}
        subheader={
          collapsed ? null : (
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
                px: 2,
                pt: 1.5,
                pb: 0.5,
              }}
            >
              MENU
            </ListSubheader>
          )
        }
      >
        {menuItems.map((item) => (
          <Box key={item.to} sx={{ px: collapsed ? 0.5 : 1, py: 0.25 }}>
            <NavItem {...item} collapsed={collapsed} />
          </Box>
        ))}
      </List>

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          p: 1,
        }}
      >
        <Tooltip
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          placement="right"
        >
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  )
})
