import React, { createContext, useContext, useEffect, useState } from "react";
import {
  charityLightTheme,
  charityDarkTheme,
  warmHopeTheme,
  elegantCompassionTheme,
  vibrantImpactTheme,
  sereneTrustTheme,
  darkModernTheme,
  sudanHeritageTheme,
} from "../theme/theme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme definitions with metadata
export const availableThemes = {
  warmHope: {
    name: "Warm Hope",
    theme: warmHopeTheme,
    description: "Warm, uplifting, and hopeful",
    icon: "🌅",
  },
  elegantCompassion: {
    name: "Elegant Compassion",
    theme: elegantCompassionTheme,
    description: "Soft, elegant, and compassionate",
    icon: "💜",
  },
  vibrantImpact: {
    name: "Vibrant Impact",
    theme: vibrantImpactTheme,
    description: "Energetic, bold, and impactful",
    icon: "⚡",
  },
  sereneTrust: {
    name: "Serene Trust",
    theme: sereneTrustTheme,
    description: "Calm, trustworthy, and serene",
    icon: "🌊",
  },
  darkModern: {
    name: "Dark Modern",
    theme: darkModernTheme,
    description: "Modern, sleek, and dark",
    icon: "🌙",
  },
  sudanHeritage: {
    name: "Sudan Heritage",
    theme: sudanHeritageTheme,
    description: "Inspired by Sudanese culture",
    icon: "🏛️",
  },
  charityLight: {
    name: "Charity Light",
    theme: charityLightTheme,
    description: "Classic charity theme",
    icon: "💙",
  },
  charityDark: {
    name: "Charity Dark",
    theme: charityDarkTheme,
    description: "Dark charity theme",
    icon: "🌌",
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("warmHope");
  const [direction, setDirection] = useState("rtl");

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") || "warmHope";
    setCurrentTheme(savedTheme);
    setDirection("rtl"); // Always RTL for Arabic

    // Apply theme to document
    applyTheme(savedTheme);
  }, []);

  // Apply theme to document
  const applyTheme = (themeName) => {
    const html = document.documentElement;
    const theme = availableThemes[themeName]?.theme;

    if (theme) {
      // Apply MUI theme colors to CSS custom properties
      const palette = theme.palette;

      // Set CSS custom properties for global use
      html.style.setProperty("--primary-color", palette.primary.main);
      html.style.setProperty("--primary-light", palette.primary.light);
      html.style.setProperty("--primary-dark", palette.primary.dark);
      html.style.setProperty("--secondary-color", palette.secondary.main);
      html.style.setProperty("--secondary-light", palette.secondary.light);
      html.style.setProperty("--secondary-dark", palette.secondary.dark);
      html.style.setProperty("--background-color", palette.background.default);
      html.style.setProperty("--paper-color", palette.background.paper);
      html.style.setProperty("--text-primary", palette.text.primary);
      html.style.setProperty("--text-secondary", palette.text.secondary);
      html.style.setProperty(
        "--accent-color",
        palette.accent?.main || palette.primary.main
      );

      // Apply dark mode class if theme is dark
      if (palette.mode === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }

    // Apply language and direction (Arabic only)
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");

    // Update document title
    document.title =
      "صدقة السعاتة الدومة - موقع خيري لمساعدة أهالي منطقة السعاتة الدومة";
  };

  // Change theme
  const changeTheme = (themeName) => {
    if (availableThemes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem("selectedTheme", themeName);
      applyTheme(themeName);
    }
  };

  // Get current theme object
  const getCurrentTheme = () => {
    return availableThemes[currentTheme]?.theme || warmHopeTheme;
  };

  // Get current theme metadata
  const getCurrentThemeInfo = () => {
    return availableThemes[currentTheme] || availableThemes.warmHope;
  };

  // Get text direction
  const getDirection = () => {
    return direction;
  };

  const value = {
    currentTheme,
    direction,
    changeTheme,
    getCurrentTheme,
    getCurrentThemeInfo,
    getDirection,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider
        theme={availableThemes[currentTheme]?.theme || warmHopeTheme}
      >
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
