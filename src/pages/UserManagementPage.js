import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Users, Mail, Shield, X, Check, AlertCircle } from "lucide-react";
import { getAllUsers, deleteUserById, updateUserById, createUserByAdminCloud } from "../services/userService";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.displayName || user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || user.adminType || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("فشل في تحميل المستخدمين.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setForm({
      displayName: user.displayName || user.name || "",
      email: user.email || "",
      role: user.role || user.adminType || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    setLoading(true);
    try {
      await deleteUserById(user.id || user.uid);
      setUsers((prev) => prev.filter((u) => u.id !== user.id && u.uid !== user.uid));
      showNotification("تم حذف المستخدم بنجاح");
    } catch (err) {
      showNotification("فشل في حذف المستخدم", 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editUser) {
        await updateUserById(editUser.id || editUser.uid, form);
        setUsers((prev) => prev.map((u) => (u.id === editUser.id || u.uid === editUser.uid ? { ...u, ...form } : u)));
        showNotification("تم تحديث المستخدم بنجاح");
      } else {
        const newUser = await createUserByAdminCloud(form);
        setUsers((prev) => [newUser, ...prev]);
        showNotification("تم إضافة المستخدم بنجاح");
      }
      setShowForm(false);
      setEditUser(null);
      setForm({});
    } catch (err) {
      showNotification(editUser ? "فشل في تحديث المستخدم" : "فشل في إضافة المستخدم", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setEditUser(null);
    setForm({ displayName: "", email: "", role: "" });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditUser(null);
    setForm({});
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'مدير': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'محرر': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'مستخدم': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]" dir="rtl">
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
            <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="mr-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 ml-3" />
            <span className="text-green-800 dark:text-green-200 text-sm">{success}</span>
            <button 
              onClick={() => setSuccess(null)}
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-[var(--paper-color)] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
                  {editUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={form.displayName || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-[var(--divider)] rounded-lg bg-[var(--paper-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-[var(--divider)] rounded-lg bg-[var(--paper-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                      الدور
                    </label>
                    <select
                      name="role"
                      value={form.role || ""}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-[var(--divider)] rounded-lg bg-[var(--paper-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    >
                      <option value="">اختر الدور</option>
                      <option value="مدير">مدير</option>
                      <option value="محرر">محرر</option>
                      <option value="مستخدم">مستخدم</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-2 px-4 border border-[var(--divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-color)] transition-colors"
                      disabled={loading}
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleFormSave}
                      className="flex-1 py-2 px-4 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white rounded-lg transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "جاري الحفظ..." : (editUser ? "حفظ التعديلات" : "إضافة المستخدم")}
                    </button>
                  </div>
                </div>
              </div>
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
                هل أنت متأكد من حذف المستخدم "{deleteConfirm.displayName || deleteConfirm.name}"؟ 
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 px-4 border border-[var(--divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-color)] transition-colors"
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

        {/* Users List */}
        {loading && users.length === 0 ? (
          <div className="bg-[var(--paper-color)] rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">جاري تحميل المستخدمين...</p>
          </div>
        ) : (
          <div className="bg-[var(--paper-color)] rounded-xl shadow-sm overflow-hidden">
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
                    <tr key={user.id || user.uid} className="hover:bg-[var(--background-color)] transition-colors">
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role || user.adminType)}`}>
                          <Shield className="h-3 w-3 ml-1" />
                          {user.role || user.adminType || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="text-[var(--secondary-color)] hover:text-[var(--secondary-dark)] transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                <div key={user.id || user.uid} className="p-4 border-b border-[var(--divider)] last:border-b-0">
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role || user.adminType)}`}>
                          <Shield className="h-3 w-3 ml-1" />
                          {user.role || user.adminType || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user)}
                        className="p-2 text-[var(--secondary-color)] hover:text-[var(--secondary-dark)] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">
                  {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد مستخدمين"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
