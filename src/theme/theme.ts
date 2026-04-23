import { alpha, createTheme } from '@mui/material/styles'

/**
 * Design system (EtSales-inspired): green primary, cool grey surfaces, Inter typography,
 * soft elevation, rounded cards and pill controls. All visual tokens live here.
 */

/** EtSales-style reference: leafy green primary, soft mint active row */
const primaryMain = '#2ECC71'
const primaryLight = '#4ADE80'
const primaryDark = '#27AE60'

const errorMain = '#EF4444'
const warningMain = '#FACC15'

const backgroundDefault = '#F4F7FE'
const paperWhite = '#FFFFFF'
const textPrimary = '#1B1B1B'
const textSecondary = '#8898AA'
const borderSubtle = '#E8ECF2'

/** Sidebar & list active row (light mint) */
const sidebarActiveBg = '#E8F5E9'

const cardShadow = '0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#475569',
      light: '#64748B',
      dark: '#334155',
      contrastText: '#FFFFFF',
    },
    error: {
      main: errorMain,
      light: alpha(errorMain, 0.12),
      dark: '#DC2626',
    },
    warning: {
      main: warningMain,
      light: alpha(warningMain, 0.2),
      dark: '#CA8A04',
    },
    success: {
      main: primaryMain,
      light: alpha(primaryMain, 0.12),
      dark: primaryDark,
    },
    background: {
      default: backgroundDefault,
      paper: paperWhite,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    divider: borderSubtle,
    action: {
      active: alpha(textPrimary, 0.54),
      hover: alpha(textPrimary, 0.04),
      selected: alpha(primaryMain, 0.12),
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.25, color: textPrimary },
    h2: { fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.3, color: textPrimary },
    h3: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.35, color: textPrimary },
    h4: { fontWeight: 600, fontSize: '1.0625rem', lineHeight: 1.4, color: textPrimary },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.45, color: textPrimary },
    h6: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.45, color: textPrimary },
    subtitle1: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5, color: textSecondary },
    subtitle2: { fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.5, color: textSecondary },
    body1: { fontSize: '0.875rem', lineHeight: 1.6, color: textPrimary },
    body2: { fontSize: '0.8125rem', lineHeight: 1.6, color: textSecondary },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0.01, fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, color: textSecondary },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: backgroundDefault,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'inherit',
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: paperWhite,
          color: textPrimary,
          borderBottom: `1px solid ${borderSubtle}`,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 9999,
          paddingInline: 22,
          paddingBlock: 10,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: primaryDark,
          },
        },
        outlined: {
          borderColor: borderSubtle,
          '&:hover': {
            borderColor: alpha(textPrimary, 0.2),
            backgroundColor: alpha(textPrimary, 0.02),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          backgroundColor: alpha(paperWhite, 0.9),
          '& fieldset': {
            borderColor: borderSubtle,
          },
          '&:hover fieldset': {
            borderColor: alpha(textPrimary, 0.18),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: cardShadow,
        },
        elevation2: {
          boxShadow: cardShadow,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: cardShadow,
          border: `1px solid ${borderSubtle}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${borderSubtle}`,
          backgroundColor: paperWhite,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          marginInline: 8,
          color: textPrimary,
          '&:hover': {
            backgroundColor: alpha(textPrimary, 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: sidebarActiveBg,
            color: primaryMain,
            '&:hover': {
              backgroundColor: alpha(primaryMain, 0.14),
            },
            '& .MuiListItemIcon-root': {
              color: primaryMain,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: alpha(textPrimary, 0.55),
          minWidth: 40,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(borderSubtle, 0.8),
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          color: textSecondary,
          backgroundColor: alpha(backgroundDefault, 0.8),
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9999,
        },
        colorSuccess: {
          backgroundColor: alpha(primaryMain, 0.12),
          color: primaryDark,
        },
        colorError: {
          backgroundColor: alpha(errorMain, 0.12),
          color: '#B91C1C',
        },
        colorWarning: {
          backgroundColor: alpha(warningMain, 0.25),
          color: '#A16207',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: textSecondary,
          '&:hover': {
            backgroundColor: alpha(textPrimary, 0.06),
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
  },
})
