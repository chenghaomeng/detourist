import { createTheme } from '@mui/material/styles';

// Google Maps-inspired Material 3 theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Google Blue
      light: '#4285f4',
      dark: '#1557b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5f6368', // Google Gray
      light: '#80868b',
      dark: '#3c4043',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#e8eaed',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: {
      fontSize: '18px',
      fontWeight: 500,
      color: '#202124',
    },
    body1: {
      fontSize: '14px',
      color: '#202124',
    },
    body2: {
      fontSize: '12px',
      color: '#5f6368',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            '&:hover': {
              boxShadow: '0 1px 6px rgba(32,33,36,.28)',
            },
            '&.Mui-focused': {
              boxShadow: '0 1px 6px rgba(32,33,36,.28)',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #e8eaed',
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(95, 99, 104, 0.08)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 6px rgba(32,33,36,.28)',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(32,33,36,.28)',
          },
        },
      },
    },
  },
});


