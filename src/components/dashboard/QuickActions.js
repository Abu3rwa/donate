import React from "react";
import { Link } from "react-router-dom";

const QuickActions = ({
  user,
  hasPermission,
  onAddDonation,
  onShowFinancialReports,
}) => {
  const getPermissionBasedActions = () => {
    const actions = [];

    const isSuperAdmin = user && user.adminType === "super_admin";
    // Donation Management
    if (isSuperAdmin || hasPermission("manage_donations")) {
      actions.push({
        name: "إضافة تبرع جديد",
        onClick: onAddDonation,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
        color: "primary",
      });
    }

    // Campaign Management
    if (isSuperAdmin || hasPermission("manage_campaigns")) {
      actions.push({
        name: "إدارة الحملات",
        link: "/dashboard/campaigns",
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
        color: "orange",
      });
    }

    // User Management
    if (isSuperAdmin || hasPermission("manage_users")) {
      actions.push({
        name: "إدارة المستخدمين",
        link: "/dashboard/users",
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        ),
        color: "success",
      });
    }

    // Volunteer Management (if you have a VolunteerManagement component/route)
    if (isSuperAdmin || hasPermission("manage_volunteers")) {
      actions.push({
        name: "إدارة التبرعات",
        link: "/dashboard/donations",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        ),
        color: "teal",
      });
    }

    // Content Moderation (if you have a ContentModeration component/route)
    if (isSuperAdmin || hasPermission("moderate_content")) {
      actions.push({
        name: "مراجعة المحتوى",
        link: "/dashboard/content-moderation",
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "info",
      });
    }

    // Expenses Management
    if (isSuperAdmin || hasPermission("manage_expenses")) {
      actions.push({
        name: "المصروفات",
        link: "/dashboard/expenses",
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: "warning",
      });
    }

    // Bills Management
    if (isSuperAdmin || hasPermission("manage_bills")) {
      actions.push({
        name: "الفواتير",
        link: "/dashboard/bills",
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0h8m-8 0v10a1 1 0 001 1h6a1 1 0 001-1V7m-8 0h8" />
          </svg>
        ),
        color: "red",
      });
    }

    // Financial Management
    if (isSuperAdmin || hasPermission("manage_finances")) {
      actions.push({
        name: "التقارير المالية",
        link: "/dashboard/financial-reports",
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        color: "purple",
      });
    }

    // Settings (Super Admin only)
    if (isSuperAdmin) {
      actions.push({
        name: "الإعدادات",
        link: "/dashboard/settings",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4m-8 0H4" />
          </svg>
        ),
        color: "gray",
      });
    }

    // Manage Stories/Content (Content Manager or Admin)
    if (isSuperAdmin || user && (user.adminType === "content_manager" || user.adminType === "admin")) {
      actions.push({
        name: "إدارة القصص",
        link: "/dashboard/stories",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zm0 0v-8" />
          </svg>
        ),
        color: "indigo",
      });
    }

    return actions;
  };

  const getColorClasses = (color) => {
    const colors = {
      gray:    "bg-gray-600 text-white hover:bg-gray-700",
      red:     "bg-red-600 text-white hover:bg-red-700",
      yellow:  "bg-yellow-500 text-white hover:bg-yellow-600",
      green:   "bg-green-600 text-white hover:bg-green-700",
      blue:    "bg-blue-600 text-white hover:bg-blue-700",
      indigo:  "bg-indigo-600 text-white hover:bg-indigo-700",
      purple:  "bg-purple-600 text-white hover:bg-purple-700",
      pink:    "bg-pink-600 text-white hover:bg-pink-700",
      orange:  "bg-orange-500 text-white hover:bg-orange-600",
      teal:    "bg-teal-600 text-white hover:bg-teal-700",
      cyan:    "bg-cyan-600 text-white hover:bg-cyan-700",
      lime:    "bg-lime-500 text-white hover:bg-lime-600",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
      fuchsia: "bg-fuchsia-600 text-white hover:bg-fuchsia-700",
      rose:    "bg-rose-600 text-white hover:bg-rose-700",
      sky:     "bg-sky-600 text-white hover:bg-sky-700",
      violet:  "bg-violet-600 text-white hover:bg-violet-700",
     
      primary:
        "bg-[var(--primary-light)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white",
      secondary:
        "bg-[var(--secondary-light)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white",
      accent:
        "bg-[var(--accent-color,#fbbf24)] text-white hover:bg-[var(--primary-color)] hover:text-white",
      success:
        "bg-green-600 text-white hover:bg-green-700",
      warning:
        "bg-[var(--warning-color,#f59e42)] text-white hover:bg-yellow-600",
      info:
        "bg-[var(--info-color,#0ea5e9)] text-white hover:bg-blue-700",
      purple:
        "bg-purple-600 text-white hover:bg-purple-700",
    };
    return colors[color] || "bg-[var(--primary-light)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white";
  };

  const actions = getPermissionBasedActions();

  return (
    <div>
      {/* Main Quick Actions as a horizontal row, compact and responsive */}
      <div className="flex flex-row flex-wrap gap-3 sm:gap-4 justify-start items-stretch">
        {actions.map((action) =>
          action.link ? (
            <Link
              key={action.name}
              to={action.link}
              className={`flex flex-col items-center justify-center min-w-[100px] max-w-[160px] sm:min-w-[140px] sm:max-w-xs px-4 py-4 sm:px-6 sm:py-5 rounded-xl sm:rounded-2xl shadow transition-colors duration-200 text-sm sm:text-base ${getColorClasses(
                action.color
              )}`}
              style={{ flex: "1 1 100px", minHeight: "110px" }}
            >
              <div className="mb-1 sm:mb-2">{React.cloneElement(action.icon, { className: 'w-12 h-12' })}</div>
              <span className="font-semibold text-center leading-tight">{action.name}</span>
            </Link>
          ) : action.onClick ? (
            <button
              key={action.name}
              type="button"
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center min-w-[100px] max-w-[160px] sm:min-w-[140px] sm:max-w-xs px-4 py-4 sm:px-6 sm:py-5 rounded-xl sm:rounded-2xl shadow transition-colors duration-200 text-sm sm:text-base ${getColorClasses(
                action.color
              )}`}
              style={{ flex: "1 1 100px", minHeight: "110px" }}
            >
              <div className="mb-1 sm:mb-2">{React.cloneElement(action.icon, { className: 'w-12 h-12' })}</div>
              <span className="font-semibold text-center leading-tight">{action.name}</span>
            </button>
          ) : null
        )}
        {actions.length === 0 && (
          <div className="text-center py-4 w-full">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              لا توجد إجراءات متاحة لصلاحياتك الحالية
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
