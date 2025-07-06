import React from "react";

const DashboardHeader = ({ onMenuClick, user, onLogout, adminInfo }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Section - Menu Button & Title */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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

          {/* Dashboard Title */}
          <div className="mr-4 lg:mr-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              لوحة التحكم
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              جمعية السعاتة الدومة الخيرية
            </p>
          </div>
        </div>

        {/* Right Section - User Menu & Notifications */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
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
                d="M15 17h5l-5 5v-5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-secondary-500"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-3 space-x-reverse text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <div className="flex items-center">
                {/* User Avatar */}
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "م"}
                  </span>
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="mr-3 hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName || "المستخدم"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Logout Button */}
          <button onClick={onLogout} className="btn-outline text-sm px-3 py-2">
            تسجيل الخروج
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
