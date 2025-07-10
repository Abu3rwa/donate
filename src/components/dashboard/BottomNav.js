
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = ({ user, hasPermission, onAddDonation, onShowFinancialReports }) => {
  const location = useLocation();
  const isDashboard = location.pathname.split("/").pop() === "dashboard";
  console.log(isDashboard);
  if (isDashboard) return null;

  const getPermissionBasedActions = () => {
    const actions = [];
    const isSuperAdmin = user && user.adminType === "super_admin";
    // Donation Management
    if (isSuperAdmin || hasPermission("manage_donations")) {
      actions.push({
        name: "تبرع",
        onClick: onAddDonation,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        color: "primary",
      });
    }
    if (isSuperAdmin || hasPermission("manage_campaigns")) {
      actions.push({
        name: "حملات",
        link: "/dashboard/campaigns",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        color: "orange",
      });
    }
    
    if (isSuperAdmin || hasPermission("manage_volunteers")) {
      actions.push({
        name: "تبرعات",
        link: "/dashboard/donations",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        color: "teal",
      });
    }
     
    if (isSuperAdmin || hasPermission("manage_bills")) {
      actions.push({
        name: "فواتير",
        link: "/dashboard/bills",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0h8m-8 0v10a1 1 0 001 1h6a1 1 0 001-1V7m-8 0h8" />
          </svg>
        ),
        color: "red",
      });
    }
    if (isSuperAdmin || hasPermission("manage_finances")) {
      actions.push({
        name: "مالية",
        link: "/dashboard/financial-reports",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: "purple",
      });
    }
     
    
    return actions;
  };

  const actions = getPermissionBasedActions();

  return (
    <nav className="fixed flex flex-wrap bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-around items-center py-2 shadow-lg lg:hidden">
      {actions.map((action) =>
        action.link ? (
          <Link
            key={action.name}
            to={action.link}
            className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-[var(--primary-color)] m-1 min-w-[60px]"
          >
            {action.icon}
            <span className="mt-1">{action.name}</span>
          </Link>
        ) : action.onClick ? (
          <button
            key={action.name}
            type="button"
            onClick={action.onClick}
            className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-[var(--primary-color)] m-1 min-w-[60px]"
          >
            {action.icon}
            <span className="mt-1">{action.name}</span>
          </button>
        ) : null
      )}
    </nav>
  );
};

export default BottomNav; 