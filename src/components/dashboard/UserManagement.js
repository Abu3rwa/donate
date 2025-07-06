import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";

const UserManagement = () => {
  const {
    hasPermission,
    promoteToAdmin,
    demoteFromAdmin,
    ADMIN_TYPES,
    ADMIN_PERMISSIONS,
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);

  useEffect(() => {
    if (hasPermission("manage_users")) {
      fetchUsers();
    }
  }, [hasPermission]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("خطأ في جلب بيانات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId, adminType) => {
    try {
      await promoteToAdmin(userId, adminType);
      toast.success("تم ترقية المستخدم بنجاح");
      setShowPromoteDialog(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("خطأ في ترقية المستخدم: " + error.message);
    }
  };

  const handleDemoteUser = async (userId) => {
    try {
      await demoteFromAdmin(userId);
      toast.success("تم إلغاء صلاحيات المدير بنجاح");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("خطأ في إلغاء الصلاحيات: " + error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.adminType) ||
      (filterRole === "user" && !user.adminType);

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (user) => {
    if (user.adminType) {
      const adminInfo = ADMIN_PERMISSIONS[user.adminType];
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
          {adminInfo?.name || "مدير"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        مستخدم
      </span>
    );
  };

  const getStatusBadge = (user) => {
    if (user.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          نشط
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
        غير نشط
      </span>
    );
  };

  if (!hasPermission("manage_users")) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <p>ليس لديك صلاحية لإدارة المستخدمين</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة المستخدمين
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة المستخدمين وصلاحياتهم
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={fetchUsers} className="btn-primary">
            تحديث القائمة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="البحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="form-input w-full"
          >
            <option value="all">جميع المستخدمين</option>
            <option value="admin">المديرون</option>
            <option value="user">المستخدمون العاديون</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              جاري تحميل المستخدمين...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    آخر تسجيل دخول
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {userItem.displayName?.charAt(0) ||
                              userItem.email?.charAt(0) ||
                              "م"}
                          </span>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userItem.displayName || "بدون اسم"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(userItem)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(userItem)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userItem.createdAt
                        ? new Date(userItem.createdAt).toLocaleDateString(
                            "ar-EG"
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userItem.lastLogin
                        ? new Date(userItem.lastLogin).toLocaleDateString(
                            "ar-EG"
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        {!userItem.adminType ? (
                          <button
                            onClick={() => {
                              setSelectedUser(userItem);
                              setShowPromoteDialog(true);
                            }}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            ترقية
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemoteUser(userItem.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            إلغاء الصلاحيات
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Promote User Dialog */}
      {showPromoteDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ترقية {selectedUser.displayName || selectedUser.email}
            </h3>
            <div className="space-y-4">
              {Object.entries(ADMIN_TYPES).map(([key, value]) => {
                const adminInfo = ADMIN_PERMISSIONS[value];
                return (
                  <button
                    key={key}
                    onClick={() => handlePromoteUser(selectedUser.id, value)}
                    className="w-full text-right p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {adminInfo.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {adminInfo.description}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={() => {
                  setShowPromoteDialog(false);
                  setSelectedUser(null);
                }}
                className="btn-outline"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
