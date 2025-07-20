import React, { useState, useRef } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Shield,
  X,
  Check,
  AlertCircle,
  MoreVertical,
  KeyRound,
  LogOut,
  Table,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { ADMIN_TYPES, ADMIN_PERMISSIONS } from "../../contexts/AuthContext";
import { getRoleColor, isAdmin, isRegularUser } from "./UserManagementHelpers";
import {
  resetPasswordByAdminCloud,
  signOutUserByAdminCloud,
  sendPasswordResetEmailByAdminCloud,
  deleteUserDocByIdTemp,
} from "../../services/userService";
import { getFunctions, httpsCallable } from "firebase/functions";
import "./userManagement.css";
import ActionMenu from "./ActionMenu";
import MobileUserList from "./MobileUserList";
import MEMBERSHIP_TYPE_AR from "../../helpers/membershipType";
import ADMIN_TYPES_AR from "../../helpers/adminTypesMap";
import UserDetailsModal from "./UserDetailsModal";
import MemberOfficeRoleBadge from "./MemberOfficeRoleBadge";

export const UserList = ({
  filteredUsers,
  loading,
  error,
  success,
  searchTerm,
  setSearchTerm,
  handleAddUserClick,
  handleEdit,
  setDeleteConfirm,
  setShowPermissions,
  currentUser,
  handleUpgrade,
  handleDowngrade,
  showNotification,
  onUserDeleted,
  onShowUserDetails,
}) => {
  const [view, setView] = useState("table"); // 'table' or 'cards'
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);

  const menuRef = useRef();
  // Delete user document from Firestore by user id (uid)
  const handleDeleteUserById = async (uid) => {
    console.log(uid);
    try {
      await deleteUserDocByIdTemp(uid);

      showNotification &&
        showNotification("تم حذف المستخدم بنجاح", { type: "success" });
    } catch (error) {
      showNotification &&
        showNotification("حدث خطأ أثناء حذف المستخدم", { type: "error" });
      console.error("Error deleting user by id:", error);
    }
  };

  // Close menu on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuUserId(null);
      }
    }
    if (openMenuUserId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuUserId]);

  // Remove the inline handleDeleteUser and use the imported one
  // Fix: force update the list after a user is deleted

  // Add this function to handle user sign out
  const handleSignOutUser = (user) => {
    // Implement your sign out logic here
    // For now, just show a notification
    showNotification &&
      showNotification(
        `تم تسجيل خروج المستخدم: ${
          user.displayName || user.name || user.email
        }`,
        { type: "info" }
      );
  };

  return (
    <div
      className="min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]"
      dir="rtl"
      style={{
        fontFamily:
          "'Tajawal', 'Cairo', 'Alexandria', 'Amiri', 'DM Serif Text', Tahoma, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="bg-[var(--paper-color)] shadow-sm border-b border-[var(--divider)] gradient-accent rounded">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-[var(--primary-color)] p-2 rounded-lg  ">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                إدارة المستخدمين
              </h1>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {filteredUsers.length} مستخدم
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto   lg:px-8 py-6">
        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 ml-3" />
            <span className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </span>
            <button
              onClick={() => showNotification(null, "error")}
              className="mr-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 ml-3" />
            <span className="text-green-800 dark:text-green-200 text-sm">
              {success}
            </span>
            <button
              onClick={() => showNotification(null, "success")}
              className="mr-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-[var(--divider)] rounded-lg bg-[var(--paper-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg transition-colors font-medium`}
              onClick={handleAddUserClick}
            >
              <Plus className="h-4 w-4" />
              إضافة مستخدم
            </button>
          </div>
        </div>

        {/* Users List */}
        {loading && filteredUsers.length === 0 ? (
          <div className="bg-[var(--paper-color)] rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">
              جاري تحميل المستخدمين...
            </p>
          </div>
        ) : view === "table" ? (
          <div className="bg-[var(--paper-color)] rounded-xl shadow-sm overflow-visible">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      المستخدم
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id || user.uid}
                      className={`hover:bg-[var(--background-color)] transition-colors ${
                        currentUser &&
                        (user.id === currentUser.uid ||
                          user.uid === currentUser.uid)
                          ? "ring-2 ring-[var(--primary-color)] bg-yellow-50 dark:bg-yellow-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Avatar */}
                          {user.photoURL || user.profileImage ? (
                            <img
                              src={user?.photoURL}
                              alt={user.displayName || user.name || "—"}
                              className="w-10 h-10 rounded-full object-cover border ml-3"
                            />
                          ) : (
                            <div className="bg-[var(--primary-light)] p-2 rounded-lg ml-3">
                              <Users className="h-5 w-5 text-[var(--primary-color)]" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                              {user.displayName || user.name || "—"}
                              <MemberOfficeRoleBadge
                                memberOfficeRole={user.memberOfficeRole}
                              />
                              {currentUser &&
                                (user.id === currentUser.uid ||
                                  user.uid === currentUser.uid) && (
                                  <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-xs text-yellow-900 font-bold">
                                    أنت
                                  </span>
                                )}
                            </div>
                            <div
                              onClick={() =>
                                handleDeleteUserById(user.id || user.uid)
                              }
                              className="text-sm text-[var(--text-secondary)] flex items-center"
                            >
                              <Mail className="h-3 w-3 ml-1" />
                              {user.phone || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            user.adminType
                              ? ADMIN_PERMISSIONS[user.adminType]?.name
                              : user.role
                          )}`}
                        >
                          <Shield className="h-3 w-3 ml-1" />
                          {user.adminType
                            ? ADMIN_PERMISSIONS[user.adminType]?.name ||
                              user.role
                            : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!(
                          currentUser &&
                          (user.id === currentUser.uid ||
                            user.uid === currentUser.uid)
                        ) && (
                          <>
                            <ActionMenu
                              user={user}
                              handleEdit={handleEdit}
                              setDeleteConfirm={setDeleteConfirm}
                              showNotification={showNotification}
                              onShowUserDetails={onShowUserDetails}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile List View */}
            <div className="block md:hidden">
              <MobileUserList
                filteredUsers={filteredUsers}
                onEdit={handleEdit}
                onDelete={setDeleteConfirm}
                onSignOut={handleSignOutUser}
                onShowDetails={setDetailsUser}
              />
            </div>
          </div>
        ) : (
          // Card View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id || user.uid}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center relative hover:shadow-2xl transition-shadow ${
                  currentUser &&
                  (user.id === currentUser.uid || user.uid === currentUser.uid)
                    ? "ring-2 ring-[var(--primary-color)] bg-yellow-50 dark:bg-yellow-900/20"
                    : ""
                }`}
              >
                {/* Avatar */}
                {user.photoURL || user.profileImage ? (
                  <img
                    src={user.photoURL || user.profileImage}
                    alt={user.displayName || user.name || "—"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--primary-color)] mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-[var(--primary-color)]" />
                  </div>
                )}

                {/* Name and Email */}
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 justify-center">
                    {user.displayName || user.name || "—"}
                    <MemberOfficeRoleBadge
                      memberOfficeRole={user.memberOfficeRole}
                    />
                    {currentUser &&
                      (user.id === currentUser.uid ||
                        user.uid === currentUser.uid) && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-xs text-yellow-900 font-bold">
                          أنت
                        </span>
                      )}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {user.email || "—"}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {user.phone || "—"}
                  </div>
                </div>

                {/* Role Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    user.adminType
                      ? "bg-yellow-100 text-yellow-800"
                      : user.role === "مشاهد"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <Shield className="h-3 w-3 ml-1" />
                  {user.adminType
                    ? ADMIN_PERMISSIONS[user.adminType]?.name || user.role
                    : user.role}
                </span>

                {/* Action Buttons for Card View */}
                <div className="mt-3">
                  {!(
                    currentUser &&
                    (user.id === currentUser.uid ||
                      user.uid === currentUser.uid)
                  ) && (
                    <ActionMenu
                      user={user}
                      handleEdit={handleEdit}
                      setDeleteConfirm={setDeleteConfirm}
                      showNotification={showNotification}
                      onShowUserDetails={onShowUserDetails}
                    />
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">
                  {searchTerm ? "لا تأجد نتائج للبحث" : "لا توجد مستخدمين"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {detailsUser && (
        <UserDetailsModal
          user={detailsUser}
          onClose={() => setDetailsUser(null)}
        />
      )}
    </div>
  );
};
