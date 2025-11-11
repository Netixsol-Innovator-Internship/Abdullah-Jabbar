"use client";

import { createTheme } from "@mui/material/styles";

// Extend MUI's Palette to include custom color tokens
declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      purple: string;
      grayLight: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      purple?: string;
      grayLight?: string;
    };
  }
}

// Core palette tokens used across the app. Keep this file as the single source
// of truth for color names referenced in components.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E50FF", // Primary/Blue
      light: "#5699FF",
      dark: "#1640CC",
    },
    secondary: {
      main: "#051139", // Secondary/Navy
      light: "#081956",
    },
    background: {
      default: "#051139",
      paper: "#051139",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#EBEBEB",
      disabled: "#EBEBEB",
    },
    custom: {
      purple: "#AA00FF",
      grayLight: "#D9D9D9",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h5: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "40px",
    },
    allVariants: {
      color: "#FFFFFF",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Poppins, Arial, sans-serif",
          backgroundColor: "#051139",
          color: "#FFFFFF",
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
    MuiTypography: {
      defaultProps: {
        color: "text.primary",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
