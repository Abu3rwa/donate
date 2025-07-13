import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher";

const SideBar = ({ isOpen, onClose, user, onLogout, navigationItems }) => {
  return (
    <>
      {/* Overlay and Sidebar only rendered when isOpen is true */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          ></div>
          <aside
            className="fixed inset-0 z-50 w-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden translate-x-0"
            aria-hidden={!isOpen}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <ThemeSwitcher />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                لوحة التحكم
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "م"}
                  </span>
                </div>
                <div className="mr-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.displayName || "المستخدم"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  {item.icon && <span className="ml-3">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200 mt-2"
              >
                <span className="ml-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                تسجيل الخروج
              </button>
            </div>
          </aside>
        </>
      )}
      {/* Desktop Sidebar (static) */}
      <aside
        className="hidden pt-20 lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:right-0 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:bg-white dark:lg:bg-gray-900 lg:top-0 lg:h-screen lg:z-40"
        style={{
          fontFamily:
            "'Tajawal', 'Cairo', 'Alexandria', 'Amiri', 'DM Serif Text', Tahoma, Arial, sans-serif",
        }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <ThemeSwitcher />
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "م"}
              </span>
            </div>
            <div className="mr-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.displayName || "المستخدم"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              {item.icon && <span className="ml-3">{item.icon}</span>}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200 mt-2"
          >
            <span className="ml-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </span>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
};

export default SideBar;
