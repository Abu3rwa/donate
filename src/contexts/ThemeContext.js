import React, { createContext, useContext, useEffect, useState } from "react";
import { charityLightTheme, charityDarkTheme } from "../theme/theme";
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
  // Always use light theme, no switching
  React.useEffect(() => {
    const html = document.documentElement;
    const theme = charityLightTheme;
    const palette = theme.palette;
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
    html.classList.remove("dark");
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
    document.title =
      "صدقة السعاتة الدومة - موقع خيري لمساعدة أهالي منطقة السعاتة الدومة";
  }, []);

  const value = {
    currentTheme: "charityLight",
    direction: "rtl",
    changeTheme: () => {},
    getCurrentTheme: () => charityLightTheme,
    getCurrentThemeInfo: () => availableThemes.charityLight,
    getDirection: () => "rtl",
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={charityLightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
