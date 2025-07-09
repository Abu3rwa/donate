import React from "react";
import QuickActions from './QuickActions'
import ThemeSwitcher from "../ThemeSwitcher";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import logo from "../../assets/tempLogo.png";
 
const DashboardHeader = ({ onMenuClick, user, onLogout, adminInfo, ...quickActionsProps }) => {
  const { getDirection } = useLanguage();
  const dir = getDirection();
  return (
    
    <header dir={dir} className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 bg-[var(--paper-color)] fixed top-0 left-0 right-0 z-40 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile: Two rows, Desktop: One row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* First row: Logo and App Name */}
          <div className="flex items-center justify-between">
           
            <Link to="/dashboard" className="ml-4 lg:mr-0 flex flex-row items-start gap-2">
            <img src={logo} alt="logo" className="w-10 h-10" />
               <div>

               
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">لوحة التحكم</h1>
              <small className="text-xs text-gray-500 dark:text-gray-400">جمعية السعاتة الدومة الخيرية</small>
              </div></Link>
            {/* Mobile Menu Button */}

            <div className="flex items-center gap-2 lg:hidden">  
              <ThemeSwitcher /> 
              <button
                onClick={e => {
                  e.currentTarget.blur();
                  onMenuClick();
                }}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
             
            </div>
          </div>
        
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
