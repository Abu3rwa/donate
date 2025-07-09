import React from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 rtl"
      dir="rtl"
    >
      <main className={isDashboard ? "" : ""}>{children}</main>
    </div>
  );
};

export default Layout;
