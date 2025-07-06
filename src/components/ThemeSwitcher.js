import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ direction: "rtl" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 min-w-[140px]"
        style={{
          backgroundColor: "var(--paper-color)",
          color: "var(--text-primary)",
          borderColor: "var(--divider)",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-xl">
          {availableThemes[currentTheme]?.icon || "🎨"}
        </span>
        <span className="font-medium truncate max-w-[80px]">
          {availableThemes[currentTheme]?.name || "Theme"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <>
          {/* Backdrop for closing dropdown on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            style={{ cursor: "default" }}
          />
          <div className="absolute right-0 top-full mt-2 min-w-[220px] w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
            <div className="p-2">
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                اختر السمة
              </h3>
              {Object.entries(availableThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md text-right transition-all duration-150 ${
                    currentTheme === key
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  style={{
                    backgroundColor:
                      currentTheme === key
                        ? "var(--primary-light)"
                        : "transparent",
                    color:
                      currentTheme === key
                        ? "var(--primary-main)"
                        : "var(--text-primary)",
                  }}
                  aria-selected={currentTheme === key}
                  role="option"
                >
                  <span className="text-xl">{theme.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-xs opacity-75">
                      {theme.description}
                    </div>
                  </div>
                  {currentTheme === key && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
