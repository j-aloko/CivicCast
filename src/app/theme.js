"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Inter as interFont } from "next/font/google";

const inter = interFont({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const baseTheme = createTheme({
  components: {
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.contrastText,
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 0,
          },
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 0,
          },
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          "&:hover": {
            textDecoration: "none",
          },
          color: "inherit",
          textDecoration: "none",
        },
        body: {
          "&::-webkit-scrollbar": {
            backgroundColor: "var(--background-paper)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--secondary-main)",
            border: "2px solid var(--background-paper)",
            borderRadius: 8,
          },
          "--background-paper": "#F5EDE6",
          "--border-color": "rgba(58, 28, 14, 0.23)",
          "--common-white": "#ffffff",
          "--secondary-main": "#D4A76A",
          "--text-primary": "#2A1509",
          "--text-secondary": "#5D3A2B",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider,
          },
          "& select:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
          },
          "& select:-webkit-autofill:focus": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
          },
          "& select:-webkit-autofill:hover": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
          },
          backgroundColor: theme.palette.common.white,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme.palette.divider,
            },
            backgroundColor: theme.palette.common.white,
            color: theme.palette.text.primary,
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
            borderRadius: "inherit",
          },
          "& input:-webkit-autofill:focus": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
          },
          "& input:-webkit-autofill:hover": {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.common.white} inset`,
          },
        }),
      },
    },
  },
  cssVariables: true,
  palette: {
    accent: {
      contrastText: "#FFFFFF",

      dark: "#047857",
      // Teal — success, positive votes
      light: "#6EE7B7",
      main: "#10B981",
    },

    background: {
      default: "#F9FAFB", // Soft gray — clean canvas
      paper: "#FFFFFF", // Card surfaces
    },

    common: {
      black: "#000000",
      white: "#FFFFFF",
    },

    error: {
      contrastText: "#FFFFFF",

      dark: "#991B1B",
      // Clear red — error states
      light: "#FCA5A5",
      main: "#DC2626",
    },

    mode: "light",

    primary: {
      // Deep blue — headers/buttons
      contrastText: "#FFFFFF",

      // Interactive blue — hover/active
      dark: "#1E40AF",

      // Civic blue — trust, clarity
      light: "#3B82F6",

      main: "#1E3A8A",
    },

    secondary: {
      // Rich amber — hover/active
      contrastText: "#1E1E1E",

      // Lighter accent — highlights
      dark: "#B45309",

      // Amber — energy, engagement
      light: "#FBBF24",

      main: "#F59E0B",
    },

    success: {
      contrastText: "#FFFFFF",

      dark: "#15803D",
      // Green — confirmed actions
      light: "#86EFAC",
      main: "#22C55E",
    },

    text: {
      // Placeholder text
      disabled: "#D1D5DB",

      // Muted gray — subtle info
      hint: "#9CA3AF",

      primary: "#1F2937",
      // Slate — strong readability
      secondary: "#4B5563", // Disabled elements
    },
  },
  shadows: [
    "none",
    "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  typography: {
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 300,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },

    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.4,
    },
    fontFamily: inter.style.fontFamily,
    fontSize: 14,
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    lineHeight: 1.5,
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
