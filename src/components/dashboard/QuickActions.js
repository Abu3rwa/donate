import React from "react";
import { Link } from "react-router-dom";

const QuickActions = ({ user, hasPermission }) => {
  const getPermissionBasedActions = () => {
    const actions = [];

    // Donation Management
    if (hasPermission("manage_donations")) {
      actions.push({
        name: "إضافة تبرع جديد",
        href: "/dashboard/donations/new",
        icon: (
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
        color: "primary",
      });
    }

    // Campaign Management
    if (hasPermission("manage_campaigns")) {
      actions.push({
        name: "إنشاء حملة جديدة",
        href: "/dashboard/campaigns/new",
        icon: (
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
        color: "secondary",
      });
    }

    // Volunteer Management
    if (hasPermission("manage_volunteers")) {
      actions.push({
        name: "إضافة متطوع",
        href: "/dashboard/volunteers/new",
        icon: (
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        ),
        color: "accent",
      });
    }

    // User Management (only for high-level admins)
    if (hasPermission("manage_users")) {
      actions.push({
        name: "إدارة المستخدمين",
        href: "/dashboard/users",
        icon: (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        ),
        color: "success",
      });
    }

    // Financial Management
    if (hasPermission("manage_finances")) {
      actions.push({
        name: "التقارير المالية",
        href: "/dashboard/financial-reports",
        icon: (
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        color: "warning",
      });
    }

    // Content Moderation
    if (hasPermission("moderate_content")) {
      actions.push({
        name: "مراجعة المحتوى",
        href: "/dashboard/content-moderation",
        icon: (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "info",
      });
    }

    // Communication Management
    if (hasPermission("manage_communications")) {
      actions.push({
        name: "إرسال إشعار",
        href: "/dashboard/notifications/send",
        icon: (
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
              d="M15 17h5l-5 5v-5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
        color: "purple",
      });
    }

    return actions;
  };

  const getColorClasses = (color) => {
    const colors = {
      primary:
        "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40",
      secondary:
        "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900/40",
      accent:
        "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/40",
      success:
        "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40",
      warning:
        "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
      info: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40",
      purple:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40",
    };
    return colors[color] || colors.primary;
  };

  const actions = getPermissionBasedActions();

  return (
    <div>
      {/* Main Quick Actions as a horizontal row */}
      <div className="flex flex-wrap gap-4 justify-start items-stretch">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className={`flex flex-col items-center justify-center min-w-[140px] max-w-xs p-4 rounded-lg shadow transition-colors duration-200 ${getColorClasses(
              action.color
            )}`}
            style={{ flex: "1 1 180px", minHeight: "110px" }}
          >
            <div className="mb-2">{action.icon}</div>
            <div className="text-center">
              <p className="text-sm font-medium">{action.name}</p>
            </div>
          </Link>
        ))}
        {actions.length === 0 && (
          <div className="text-center py-4 w-full">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              لا توجد إجراءات متاحة لصلاحياتك الحالية
            </p>
          </div>
        )}
      </div>

      {/* Additional Quick Actions as a row */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          إجراءات سريعة أخرى
        </h4>
        <div className="flex flex-wrap gap-2">
          {hasPermission("view_reports") && (
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              تصدير التقارير
            </button>
          )}
          {hasPermission("manage_donations") && (
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              إرسال إشعار للمتبرعين
            </button>
          )}
          {hasPermission("manage_volunteers") && (
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              إرسال إشعار للمتطوعين
            </button>
          )}
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            إعدادات الحساب
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
