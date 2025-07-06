import { createTheme } from "@mui/material/styles";

// Light Theme: Charity/Trust Inspired
export const charityLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Deep blue
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#fff",
    },
    secondary: {
      main: "#22c55e", // Vibrant green
      light: "#4ade80",
      dark: "#15803d",
      contrastText: "#fff",
    },
    accent: {
      main: "#fbbf24", // Gold
      light: "#fde68a",
      dark: "#b45309",
    },
    background: {
      default: "#f8fafc", // Soft light
      paper: "#fff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    divider: "#e5e7eb",
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e42",
    },
    info: {
      main: "#0ea5e9",
    },
    success: {
      main: "#22c55e",
    },
  },
  typography: {
    fontFamily: "Inter, Noto Sans Arabic, Arial, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "2.8rem",
      color: "#2563eb",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.2rem",
      color: "#2563eb",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.7rem",
      color: "#22c55e",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "#1e293b",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1.1rem",
      color: "#1e293b",
    },
    button: {
      fontWeight: 700,
      fontSize: "1rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Dark Theme: Charity/Trust Inspired
export const charityDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa", // Lighter blue for dark
      light: "#93c5fd",
      dark: "#1e40af",
      contrastText: "#fff",
    },
    secondary: {
      main: "#4ade80", // Lighter green
      light: "#bbf7d0",
      dark: "#166534",
      contrastText: "#fff",
    },
    accent: {
      main: "#fde68a", // Gold
      light: "#fef9c3",
      dark: "#b45309",
    },
    background: {
      default: "#0f172a", // Deep blue-gray
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
      disabled: "#64748b",
    },
    divider: "#334155",
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e42",
    },
    info: {
      main: "#38bdf8",
    },
    success: {
      main: "#22c55e",
    },
  },
  typography: {
    fontFamily: "Inter, Noto Sans Arabic, Arial, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "2.8rem",
      color: "#60a5fa",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.2rem",
      color: "#60a5fa",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.7rem",
      color: "#4ade80",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "#f1f5f9",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1.1rem",
      color: "#f1f5f9",
    },
    button: {
      fontWeight: 700,
      fontSize: "1rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Warm Hope Theme: Warm, uplifting, and hopeful
export const warmHopeTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff9800",
      light: "#ffc947",
      dark: "#c66900",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff7043",
      light: "#ffa270",
      dark: "#c63f17",
      contrastText: "#fff",
    },
    accent: { main: "#ffd54f" },
    background: { default: "#fff8e1", paper: "#fff3e0" },
    text: { primary: "#4e342e", secondary: "#bf360c" },
  },
  typography: {
    fontFamily: "Quicksand, Arial, sans-serif",
    h1: { fontWeight: 800, color: "#ff9800" },
    h2: { fontWeight: 700, color: "#ff7043" },
    h3: { fontWeight: 600, color: "#bf360c" },
  },
  shape: { borderRadius: 14 },
});

// Elegant Compassion Theme: Soft, elegant, and compassionate
export const elegantCompassionTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8e24aa",
      light: "#d1aaff",
      dark: "#5c007a",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f06292",
      light: "#ff94c2",
      dark: "#ba2d65",
      contrastText: "#fff",
    },
    accent: { main: "#ffd1dc" },
    background: { default: "#f3e5f5", paper: "#fff1f8" },
    text: { primary: "#4a148c", secondary: "#ad1457" },
  },
  typography: {
    fontFamily: "Merriweather, Arial, serif",
    h1: { fontWeight: 800, color: "#8e24aa" },
    h2: { fontWeight: 700, color: "#f06292" },
    h3: { fontWeight: 600, color: "#ad1457" },
  },
  shape: { borderRadius: 16 },
});

// Vibrant Impact Theme: Energetic, bold, and impactful
export const vibrantImpactTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00bcd4",
      light: "#62efff",
      dark: "#008ba3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffeb3b",
      light: "#ffff72",
      dark: "#c8b900",
      contrastText: "#333",
    },
    accent: { main: "#ff4081" },
    background: { default: "#e0f7fa", paper: "#fffde7" },
    text: { primary: "#263238", secondary: "#008ba3" },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
    h1: { fontWeight: 900, color: "#00bcd4" },
    h2: { fontWeight: 800, color: "#ff4081" },
    h3: { fontWeight: 700, color: "#ffeb3b" },
  },
  shape: { borderRadius: 10 },
});

// Serene Trust Theme: Calm, trustworthy, and serene
export const sereneTrustTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#81c784",
      light: "#b2fab4",
      dark: "#519657",
      contrastText: "#fff",
    },
    accent: { main: "#b3e5fc" },
    background: { default: "#e3f2fd", paper: "#f1f8e9" },
    text: { primary: "#0d47a1", secondary: "#388e3c" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: { fontWeight: 700, color: "#1976d2" },
    h2: { fontWeight: 600, color: "#388e3c" },
    h3: { fontWeight: 500, color: "#81c784" },
  },
  shape: { borderRadius: 12 },
});

// Dark Modern Theme: Modern, sleek, and dark
export const darkModernTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e676",
      light: "#66ffa6",
      dark: "#00b248",
      contrastText: "#212121",
    },
    secondary: {
      main: "#2979ff",
      light: "#75a7ff",
      dark: "#004ecb",
      contrastText: "#fff",
    },
    accent: { main: "#ff1744" },
    background: { default: "#121212", paper: "#232323" },
    text: { primary: "#e0e0e0", secondary: "#bdbdbd" },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h1: { fontWeight: 900, color: "#00e676" },
    h2: { fontWeight: 800, color: "#2979ff" },
    h3: { fontWeight: 700, color: "#ff1744" },
  },
  shape: { borderRadius: 8 },
});

// Sudan Heritage Theme: Inspired by Sudanese culture and heritage
export const sudanHeritageTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#c68642",
      light: "#ffb870",
      dark: "#8c4b1f",
      contrastText: "#fff",
    },
    secondary: {
      main: "#388e3c",
      light: "#66bb6a",
      dark: "#005005",
      contrastText: "#fff",
    },
    accent: { main: "#e53935" },
    background: { default: "#fff8e1", paper: "#fbe9e7" },
    text: { primary: "#4e342e", secondary: "#388e3c" },
  },
  typography: {
    fontFamily: "Cairo, Arial, sans-serif",
    h1: { fontWeight: 800, color: "#c68642" },
    h2: { fontWeight: 700, color: "#388e3c" },
    h3: { fontWeight: 600, color: "#e53935" },
  },
  shape: { borderRadius: 18 },
});

export const toastOptions = {
  duration: 4000,
  style: {
    background: "#363636",
    color: "#fff",
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: "#27AE60",
      secondary: "#fff",
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: "#E74C3C",
      secondary: "#fff",
    },
  },
};