import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const themeKeys = Object.keys(availableThemes);
  const [themeIndex, setThemeIndex] = useState(themeKeys.indexOf(currentTheme));

  // Cycle theme on click
  const handleClick = () => {
    const nextIndex = (themeIndex + 1) % themeKeys.length;
    setThemeIndex(nextIndex);
    changeTheme(themeKeys[nextIndex]);
  };

  useEffect(() => {
    setThemeIndex(themeKeys.indexOf(currentTheme));
  }, [currentTheme, themeKeys]);

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-xl"
      title="تغيير النمط"
      aria-label="تغيير النمط"
      style={{ width: 36, height: 36, minWidth: 0 }}
    >
      {availableThemes[currentTheme]?.icon || "🎨"}
    </button>
  );
};

export default ThemeSwitcher;
