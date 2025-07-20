import React from "react";
import AddUserForm from "./AddUserForm";
import {
  Trash2,
  Users,
  Mail,
  Shield,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { ADMIN_PERMISSIONS, ADMIN_TYPES } from "../../contexts/AuthContext";
import PERMISSIONS_AR from "../../helpers/permissionsMap";
import {
  adminTypeOptions,
  allPermissions,
  isAdmin,
  isRegularUser,
  getAdminTypeByName,
  getNextRole,
  getPrevRole,
} from "./UserManagementHelpers";

export const UserManagementModals = ({
  showForm,
  editUser,
  handleCancel,
  setUsers,
  setShowForm,
  setEditUser,
  deleteConfirm,
  setDeleteConfirm,
  handleDelete,
  loading,
  showPermissions,
  setShowPermissions,
  roleChangeModal,
  setRoleChangeModal,
  roleChangeForm,
  setRoleChangeForm,
  showNotification,
  currentUser,
  promoteToAdmin,
  demoteFromAdmin,
}) => {
  const handleRoleChangeAdminType = (e) => {
    const adminType = e.target.value;
    setRoleChangeForm((prev) => ({
      ...prev,
      adminType,
      permissions:
        adminType === ADMIN_TYPES.SUPER_ADMIN
          ? ["all"]
          : ADMIN_PERMISSIONS[adminType]?.permissions?.filter(
              (p) => p !== "all"
            ) || [],
    }));
  };

  const handleRoleChangePermission = (perm, checked) => {
    setRoleChangeForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, perm]
        : prev.permissions.filter((p) => p !== perm),
    }));
  };

  const handleRoleChangeConfirm = async () => {
    setRoleChangeModal((prev) => ({ ...prev, loading: true })); // Set loading state for modal
    const { user, direction } = roleChangeModal;
    const { adminType, permissions } = roleChangeForm;
    try {
      if (!adminType) {
        // Demote to regular user
        await demoteFromAdmin(user.id || user.uid);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id || u.uid === user.uid
              ? { ...u, adminType: null, role: "مستخدم", permissions: [] }
              : u
          )
        );
        showNotification("تم تخفيض المستخدم إلى مستخدم عادي");
      } else {
        await promoteToAdmin(user.id || user.uid, adminType, permissions);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id || u.uid === user.uid
              ? {
                  ...u,
                  adminType,
                  role: ADMIN_PERMISSIONS[adminType].name,
                  permissions,
                }
              : u
          )
        );
        showNotification(
          direction === "upgrade"
            ? "تم ترقية المستخدم بنجاح"
            : "تم تخفيض رتبة المستخدم بنجاح"
        );
      }
    } catch (err) {
      showNotification(
        direction === "upgrade"
          ? "فشل في ترقية المستخدم"
          : "فشل في تخفيض المستخدم",
        "error"
      );
    } finally {
      setRoleChangeModal({
        open: false,
        user: null,
        direction: null,
        loading: false,
      }); // Reset loading state
      setRoleChangeForm({ adminType: "", permissions: [] });
    }
  };

  return (
    <>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[var(--paper-color)] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AddUserForm
              onCancel={handleCancel}
              onUserAdded={(user) => {
                setUsers((prev) => [user, ...prev]);
                setShowForm(false);
                setEditUser(null);
              }}
              initialData={editUser}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[var(--paper-color)] rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg ml-3">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                تأكيد الحذف
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-6">
              هل أنت متأكد من حذف المستخدم "
              {deleteConfirm.displayName || deleteConfirm.name}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="close-btn"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 px-4 bg-[var(--secondary-color)] hover:bg-[var(--secondary-dark)] text-white rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Permissions Modal */}
      {showPermissions.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[var(--paper-color)] rounded-xl shadow-xl max-w-md w-full   p-6">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
              صلاحي��ت المستخدم
            </h2>
            <div className="mb-4">
              <div className="font-medium text-[var(--text-secondary)] mb-2">
                {showPermissions.user.displayName ||
                  showPermissions.user.name ||
                  "—"}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mb-2">
                الدور:{" "}
                {showPermissions.user.role ||
                  showPermissions.user.adminType ||
                  "—"}
              </div>
            </div>
            <ul className="list-disc pr-6 text-sm text-[var(--text-primary)]">
              {(showPermissions.user.permissions &&
              showPermissions.user.permissions.length > 0
                ? showPermissions.user.permissions
                : (showPermissions.user.adminType &&
                    ADMIN_PERMISSIONS[showPermissions.user.adminType]
                      ?.permissions) ||
                  []
              ).map((perm, idx) => (
                <li key={idx}>{PERMISSIONS_AR[perm] || perm}</li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPermissions({ open: false, user: null })}
                className="py-2 px-4 border border-[var(--divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-color)] transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal for Upgrade/Downgrade */}
      {roleChangeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[var(--paper-color)] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
                {roleChangeModal.direction === "upgrade"
                  ? "ترقية المستخدم"
                  : "تخفيض المستخدم"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                    نوع المسؤول
                  </label>
                  <select
                    value={roleChangeForm.adminType || ""}
                    onChange={handleRoleChangeAdminType}
                    className="w-full px-3 py-2 border border-[var(--divider)] rounded-lg bg-[var(--paper-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  >
                    <option value="">مستخدم عادي</option>
                    {adminTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {roleChangeForm.adminType === ADMIN_TYPES.SUPER_ADMIN && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                    ⚠️ سيتم منح هذا المستخدم جميع الصلاحيات (مدير عام). الرجاء
                    التأكد من أنك تريد تعيين هذا الدور.
                  </div>
                )}
                {roleChangeForm.adminType === ADMIN_TYPES.SUPER_ADMIN ? null : (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                      الصلاحيات
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allPermissions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={roleChangeForm.permissions.includes(perm)}
                            onChange={(e) =>
                              handleRoleChangePermission(perm, e.target.checked)
                            }
                          />
                          {perm}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setRoleChangeModal({
                        open: false,
                        user: null,
                        direction: null,
                      })
                    }
                    className="flex-1 py-2 px-4 border border-[var(--divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-color)] transition-colors"
                    disabled={loading}
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleRoleChangeConfirm}
                    className="flex-1 py-2 px-4 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white rounded-lg transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "جاري الحفظ..." : "تأكيد"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
