"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E50FF", // Primary/Blue
    },
    secondary: {
      main: "#051139", // Secondary/Navy
    },
    background: {
      default: "#051139", // Secondary/Navy
      paper: "#051139",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#EBEBEB",
      disabled: "#EBEBEB",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h5: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "40px",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Poppins, Arial, sans-serif",
          backgroundColor: "#051139",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
});

export default theme;
