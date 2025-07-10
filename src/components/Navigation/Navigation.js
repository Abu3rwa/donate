import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { NAVIGATION_AR, APP_CONFIG } from "../../constants";
import { useOrganizationInfo } from "../../contexts/OrganizationInfoContext";
import ThemeSwitcher from "../ThemeSwitcher";
import logo from '../../assets/tempLogo.png';

// Height of the fixed navbar (for layout spacing)

const Navigation = ({user}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
// const {user } = AuthCon
  const { user: contextUser, logout } = useAuth();
  const effectiveUser = user || contextUser;
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const { orgInfo } = useOrganizationInfo();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
   }, [location.pathname]);
 

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { key: "HOME", path: "/", label: NAVIGATION_AR.HOME },
    {
      key: "ABOUT",
      path: "/about",
      label: NAVIGATION_AR.ABOUT,
    },
    {
      key: "CAMPAIGNS",
      path: "/campaigns",
      label: NAVIGATION_AR.CAMPAIGNS,
    },
    {
      key: "STORIES",
      path: "/stories",
      label: NAVIGATION_AR.STORIES,
    },
    {
      key: "IMPACT",
      path: "/impact",
      label: NAVIGATION_AR.IMPACT,
    },
    {
      key: "CONTACT",
      path: "/contact",
      label: NAVIGATION_AR.CONTACT,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[var(--divider)] bg-[var(--paper-color)]/95 backdrop-blur-md shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <img
                src={logo}
                alt="شعار الجمعية"
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-center rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {orgInfo?.name || APP_CONFIG.name}
                </h1>
                <small className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {orgInfo?.longName || APP_CONFIG.longName}
                </small>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side controls (desktop only) */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* <ThemeSwitcher /> */}
            {(() => { console.log('Navigation effectiveUser:', effectiveUser); return null; })()}
            {effectiveUser && (effectiveUser.adminType === 'super_admin' || effectiveUser.adminType === 'admin') && (
              <Link to="/dashboard" className="text-sm px-4 py-2 rounded bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)] transition-colors">
                لوحة التحكم
              </Link>
            )}
            <Link to="/donate" className="text-sm px-4 py-2 rounded bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-dark)] transition-colors">
              {t("donate")}
            </Link>
          </div>

          {/* Mobile ThemeSwitcher and menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* <ThemeSwitcher /> */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200"
              aria-label="فتح القائمة"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--paper-color)] border-t border-[var(--divider)] w-full fixed top-14 left-0 z-40 shadow-lg animate-fadeIn">
          <div className="px-4 pt-4 pb-4 space-y-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-center ${
                  location.pathname === item.path
                    ? "bg-[var(--primary-light)] text-[var(--primary-color)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--background-color)] hover:text-[var(--primary-color)]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex justify-center gap-4 mt-2">
              <ThemeSwitcher />
              <Link to="/donate" className="text-sm px-4 py-2 rounded bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-dark)] transition-colors">
                {t("donate")}
              </Link>
            </div>
            {effectiveUser && (effectiveUser.adminType === 'super_admin' || effectiveUser.adminType === 'admin') ? (
              <div className="border-t border-[var(--divider)] pt-4 mt-2">
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--background-color)] hover:text-[var(--primary-color)] text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--background-color)] hover:text-[var(--primary-color)]"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="border-t border-[var(--divider)] pt-4 mt-2">
                <Link
                  to="/register"
                  className="block px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--background-color)] hover:text-[var(--primary-color)] text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
