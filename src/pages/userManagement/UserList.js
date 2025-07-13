import React from "react";
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
} from "lucide-react";
import {
  ADMIN_TYPES,
  ADMIN_PERMISSIONS,
} from "../../contexts/AuthContext";
import {
  getRoleColor,
  isAdmin,
  isRegularUser,
} from "./UserManagementHelpers";

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
  setOpenActionMenu,
  openActionMenu,
  setShowPermissions,
  currentUser,
  handleUpgrade,
  handleDowngrade,
  showNotification,
}) => {
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
      <div className="bg-[var(--paper-color)] shadow-sm border-b border-[var(--divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-[var(--primary-color)] p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                إدارة المستخدمين
              </h1>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {filteredUsers.length} مستخدم
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 ml-3" />
            <span className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </span>
            <button
              onClick={() => showNotification(null, 'error')}
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
              onClick={() => showNotification(null, 'success')}
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
          <button
            className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg transition-colors font-medium"
            onClick={handleAddUserClick}
          >
            <Plus className="h-4 w-4" />
            إضافة مستخدم
          </button>
        </div>

        {/* Users List */}
        {loading && filteredUsers.length === 0 ? (
          <div className="bg-[var(--paper-color)] rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">
              جاري تحميل المستخدمين...
            </p>
          </div>
        ) : (
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
                      className="hover:bg-[var(--background-color)] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-[var(--primary-light)] p-2 rounded-lg ml-3">
                            <Users className="h-5 w-5 text-[var(--primary-color)]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--text-primary)]">
                              {user.displayName || user.name || "—"}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] flex items-center">
                              <Mail className="h-3 w-3 ml-1" />
                              {user.email || "—"}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                        <div className="flex gap-2">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            onClick={() =>
                              setOpenActionMenu(
                                openActionMenu === (user.id || user.uid)
                                  ? null
                                  : user.id || user.uid
                              )
                            }
                            aria-label="إجراءات المستخدم"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {openActionMenu === (user.id || user.uid) && (
                            <div className="user-action-menu absolute left-0 z-50 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 text-right">
                              <button
                                onClick={() => {
                                  setOpenActionMenu(null);
                                  handleEdit(user);
                                }}
                                className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" /> تعديل
                              </button>
                              <button
                                onClick={() => {
                                  setOpenActionMenu(null);
                                  setDeleteConfirm(user);
                                }}
                                className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" /> حذف
                              </button>
                              <button
                                onClick={() => {
                                  setOpenActionMenu(null);
                                  setShowPermissions({ open: true, user });
                                }}
                                className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                              >
                                <Shield className="h-4 w-4" /> عرض الصلاحيات
                              </button>
                              {/* Super admin role controls */}
                              {currentUser?.adminType ===
                                ADMIN_TYPES.SUPER_ADMIN &&
                                currentUser?.uid !== (user.id || user.uid) && (
                                  <>
                                    {/* Upgrade: show for regular users and admins (not super admin) */}
                                    {isRegularUser(user) || isAdmin(user) ? (
                                      <button
                                        onClick={() => {
                                          setOpenActionMenu(null);
                                          handleUpgrade(user);
                                        }}
                                        className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-green-600"
                                        disabled={loading}
                                      >
                                        ▲ ترقية الدور
                                      </button>
                                    ) : null}
                                    {/* Downgrade: show for admins (not super admin) */}
                                    {isAdmin(user) ? (
                                      <button
                                        onClick={() => {
                                          setOpenActionMenu(null);
                                          handleDowngrade(user);
                                        }}
                                        className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-yellow-600"
                                        disabled={loading}
                                      >
                                        ▼ تخفيض الدور
                                      </button>
                                    ) : null}
                                  </>
                                )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user.id || user.uid}
                  className="p-4 border-b border-[var(--divider)] last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1">
                      <div className="bg-[var(--primary-light)] p-2 rounded-lg ml-3">
                        <Users className="h-5 w-5 text-[var(--primary-color)]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                          {user.displayName || user.name || "—"}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] flex items-center mb-2">
                          <Mail className="h-3 w-3 ml-1" />
                          {user.email || "—"}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
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
                      </div>
                    </div>
                    <div className="flex gap-2 relative">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === (user.id || user.uid)
                              ? null
                              : user.id || user.uid
                          )
                        }
                        aria-label="إجراءات المستخدم"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {openActionMenu === (user.id || user.uid) && (
                        <div className="user-action-menu absolute left-0 z-50 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 text-right">
                          <button
                            onClick={() => {
                              setOpenActionMenu(null);
                              handleEdit(user);
                            }}
                            className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> تعديل
                          </button>
                          <button
                            onClick={() => {
                              setOpenActionMenu(null);
                              setDeleteConfirm(user);
                            }}
                            className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" /> حذف
                          </button>
                          <button
                            onClick={() => {
                              setOpenActionMenu(null);
                              setShowPermissions({ open: true, user });
                            }}
                            className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                          >
                            <Shield className="h-4 w-4" /> عرض الصلاحيات
                          </button>
                          {currentUser?.adminType === ADMIN_TYPES.SUPER_ADMIN &&
                            currentUser?.uid !== (user.id || user.uid) && (
                              <>
                                {/* Upgrade: show for regular users and admins (not super admin) */}
                                {isRegularUser(user) || isAdmin(user) ? (
                                  <button
                                    onClick={() => {
                                      setOpenActionMenu(null);
                                      handleUpgrade(user);
                                    }}
                                    className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-green-600"
                                    disabled={loading}
                                  >
                                    ▲ ترقية الدور
                                  </button>
                                ) : null}
                                {/* Downgrade: show for admins (not super admin) */}
                                {isAdmin(user) ? (
                                  <button
                                    onClick={() => {
                                      setOpenActionMenu(null);
                                      handleDowngrade(user);
                                    }}
                                    className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-yellow-600"
                                    disabled={loading}
                                  >
                                    ▼ تخفيض الدور
                                  </button>
                                ) : null}
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">
                  {searchTerm ? "لا ت��جد نتائج للبحث" : "لا توجد مستخدمين"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};