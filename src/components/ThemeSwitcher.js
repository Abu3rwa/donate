import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={switcherRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        title="تغيير النمط"
        aria-label="تغيير النمط"
        style={{ width: 40, height: 40 }}
      >
        {availableThemes[currentTheme]?.icon || "🎨"}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          style={{
            transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
            transformOrigin: "top right",
          }}
        >
          <ul className="p-2">
            {Object.entries(availableThemes).map(([key, { name, icon }]) => (
              <li key={key}>
                <button
                  onClick={() => handleThemeChange(key)}
                  className={`w-full text-right flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    currentTheme === key
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
