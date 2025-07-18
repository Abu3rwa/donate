// src/pages/userManagement/UserManagementHelpers.js
import { ADMIN_PERMISSIONS, ADMIN_TYPES } from "../../contexts/AuthContext";

export const getRoleColor = (role) => {
  // First, check for specific admin roles by their Arabic names
  switch (role) {
    case "مدير عام": // super_admin
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "مدير": // admin
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "مشرف": // moderator
    case "مدير المالية": // finance_manager
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "مدير الحملات": // campaign_manager
    case "مدير التواصل": // communication_manager
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    case "محرر": // editor
    case "منسق المتطوعين": // volunteer_coordinator
    case "مدير التبرعات": // donation_manager
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "مشاهد": // viewer
    case "مستخدم": // user
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

export const getAdminTypeByName = (name) => {
  return Object.keys(ADMIN_PERMISSIONS).find(
    (key) => ADMIN_PERMISSIONS[key].name === name
  );
};

export const getNextRole = (adminType) => {
  const levels = Object.values(ADMIN_PERMISSIONS)
    .map((p) => p.level)
    .sort((a, b) => a - b);
  const current = ADMIN_PERMISSIONS[adminType]?.level || 0;
  const nextLevel = levels.find((lvl) => lvl > current);
  if (!nextLevel) return null;
  return Object.keys(ADMIN_PERMISSIONS).find(
    (key) => ADMIN_PERMISSIONS[key].level === nextLevel
  );
};

export const getPrevRole = (adminType) => {
  const levels = Object.values(ADMIN_PERMISSIONS)
    .map((p) => p.level)
    .sort((a, b) => a - b);
  const current = ADMIN_PERMISSIONS[adminType]?.level || 0;
  const prevLevel = [...levels].reverse().find((lvl) => lvl < current);
  if (!prevLevel) return null;
  return Object.keys(ADMIN_PERMISSIONS).find(
    (key) => ADMIN_PERMISSIONS[key].level === prevLevel
  );
};

export const adminTypeOptions = Object.keys(ADMIN_PERMISSIONS).map((key) => ({
  value: key,
  label: ADMIN_PERMISSIONS[key].name,
}));

export const allPermissions = Array.from(
  new Set(Object.values(ADMIN_PERMISSIONS).flatMap((p) => p.permissions))
).filter((p) => p !== "all");

export const isAdmin = (user) =>
  user.adminType && user.adminType !== ADMIN_TYPES.SUPER_ADMIN;
export const isRegularUser = (user) => !user.adminType;
