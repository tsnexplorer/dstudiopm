import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(47,62,85)', // Brand dark olive
      light: 'rgb(67,82,105)', // Lighter shade
      dark: 'rgb(27,42,65)', // Darker shade
      contrastText: '#fff',
    },
    secondary: {
      main: 'rgb(57,72,95)', // Slightly lighter olive
      light: 'rgb(77,92,115)', // Even lighter
      dark: 'rgb(37,52,75)', // Slightly darker
      contrastText: '#e6e8d3',
    },
    error: {
      main: '#b22222',
    },
    warning: {
      main: 'rgb(97,112,135)', // Muted olive gold
    },
    info: {
      main: 'rgb(87,102,125)', // Muted olive blue
    },
    success: {
      main: 'rgb(67,82,105)', // Olive drab shade
    },
    background: {
      default: 'rgb(47,62,85)', // Brand dark olive
      paper: 'rgb(57,72,95)', // Slightly lighter for cards
      accent: 'rgb(77,92,115)', // Accent shade for highlights
    },
    text: {
      primary: '#e6e8d3', // Light text for dark bg
      secondary: 'rgb(157,170,186)', // Muted light olive
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
