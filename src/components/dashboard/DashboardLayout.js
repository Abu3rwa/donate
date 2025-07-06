import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  const { user, logout, isAdmin, getAdminTypeInfo } = useAuth();
  const adminInfo = getAdminTypeInfo();

  // Sidebar open/close state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar (fixed on desktop) */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        user={user}
        adminInfo={adminInfo}
      />
      {/* Main content area */}
      <div className="flex-1">
        <DashboardHeader
          onMenuClick={toggleSidebar}
          user={user}
          onLogout={logout}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
