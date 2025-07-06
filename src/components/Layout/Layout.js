import React from "react";


const Layout = ({ children }) => {

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 rtl"
      dir="rtl"
    >
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
