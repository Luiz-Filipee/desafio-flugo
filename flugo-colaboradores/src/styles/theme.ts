import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: '#22C55E',
    },
    background: {
      default: '#F9FAFB',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
