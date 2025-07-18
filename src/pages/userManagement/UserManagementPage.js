import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "../../services/userService";
import {
  useAuth,
  ADMIN_TYPES,
  ADMIN_PERMISSIONS,
} from "../../contexts/AuthContext";
import { UserManagementModals } from "./UserManagementModals";
import PERMISSIONS_AR from "../../helpers/permissionsMap";
import {
  getRoleColor,
  getAdminTypeByName,
  getNextRole,
  getPrevRole,
  adminTypeOptions,
  allPermissions,
  isAdmin,
  isRegularUser,
} from "./UserManagementHelpers";
import { UserList } from "./UserList";

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
  const [openActionMenu, setOpenActionMenu] = useState(null); // user id/uid or null
  const [showPermissions, setShowPermissions] = useState({
    open: false,
    user: null,
  });
  const [roleChangeModal, setRoleChangeModal] = useState({
    open: false,
    user: null,
    direction: null,
  });
  const [roleChangeForm, setRoleChangeForm] = useState({
    adminType: "",
    permissions: [],
  });

  const { user: currentUser, promoteToAdmin, demoteFromAdmin } = useAuth();
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.displayName || user.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role || user.adminType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-action-menu")) {
        setOpenActionMenu(null);
      }
    };
    if (openActionMenu !== null) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [openActionMenu]);

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

  const showNotification = (message, type = "success") => {
    if (type === "success") {
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
      role: user.role || user.adminType || "",
      adminType: user.adminType || "",
      adminLevel: user.adminLevel || 0,
      permissions: user.permissions || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    setLoading(true);
    try {
      await deleteUserById(user.id || user.uid);
      setUsers((prev) =>
        prev.filter((u) => u.id !== user.id && u.uid !== user.uid)
      );
      showNotification("تم حذف المستخدم بنجاح");
    } catch (err) {
      showNotification("فشل في حذف المستخدم", "error");
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // When adminType changes, update adminLevel and permissions in form
  const handleAdminTypeChange = (e) => {
    const adminType = e.target.value;
    const adminConfig = ADMIN_PERMISSIONS[adminType];
    setForm((prev) => ({
      ...prev,
      adminType,
      adminLevel: adminConfig?.level || 0,
      permissions:
        adminType === ADMIN_TYPES.SUPER_ADMIN
          ? ["all"]
          : adminConfig?.permissions?.filter((p) => p !== "all") || [],
    }));
  };

  const handleFormSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let saveData = { ...form };
      if (form.role === "مدير" && form.adminType) {
        const adminConfig = ADMIN_PERMISSIONS[form.adminType];
        saveData = {
          ...saveData,
          adminType: form.adminType,
          adminLevel: adminConfig.level,
          permissions: form.permissions || [],
        };
      } else {
        saveData = {
          ...saveData,
          adminType: null,
          adminLevel: 0,
          permissions: [],
        };
      }
      if (editUser) {
        await updateUserById(editUser.id || editUser.uid, saveData);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id || u.uid === editUser.uid
              ? { ...u, ...saveData }
              : u
          )
        );
        showNotification("تم تحديث المستخدم بنجاح");
      }
      setShowForm(false);
      setEditUser(null);
      setForm({});
    } catch (err) {
      showNotification(
        editUser ? "فشل في تحديث المستخدم" : "فشل في إضافة المستخدم",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setEditUser(null);
    setForm({
      displayName: "",
      email: "",
      role: "",
      adminType: "",
      adminLevel: 0,
      permissions: [],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditUser(null);
    setForm({});
  };

  const handleUpgrade = (targetUser) => {
    const adminType =
      targetUser.adminType || getAdminTypeByName(targetUser.role);
    const nextType = getNextRole(adminType);
    if (!nextType) return;
    setRoleChangeModal({ open: true, user: targetUser, direction: "upgrade" });
    setRoleChangeForm({
      adminType: nextType,
      permissions:
        ADMIN_PERMISSIONS[nextType]?.permissions?.filter((p) => p !== "all") ||
        [],
    });
  };

  const handleDowngrade = (targetUser) => {
    const adminType =
      targetUser.adminType || getAdminTypeByName(targetUser.role);
    const prevType = getPrevRole(adminType);
    setRoleChangeModal({
      open: true,
      user: targetUser,
      direction: "downgrade",
    });
    setRoleChangeForm({
      adminType: prevType || "",
      permissions: prevType
        ? ADMIN_PERMISSIONS[prevType]?.permissions?.filter((p) => p !== "all")
        : [],
    });
  };

  return (
    <>
      <UserList
        filteredUsers={filteredUsers}
        loading={loading}
        error={error}
        success={success}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleAddUserClick={handleAddUserClick}
        handleEdit={handleEdit}
        setDeleteConfirm={setDeleteConfirm}
        setOpenActionMenu={setOpenActionMenu}
        openActionMenu={openActionMenu}
        setShowPermissions={setShowPermissions}
        currentUser={currentUser}
        handleUpgrade={handleUpgrade}
        handleDowngrade={handleDowngrade}
        showNotification={showNotification}
        // Pass user images for display
        showUserImage={true}
      />

      <UserManagementModals
        showForm={showForm}
        editUser={editUser}
        handleCancel={handleCancel}
        setUsers={setUsers}
        setShowForm={setShowForm}
        setEditUser={setEditUser}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        handleDelete={handleDelete}
        loading={loading}
        showPermissions={showPermissions}
        setShowPermissions={setShowPermissions}
        roleChangeModal={roleChangeModal}
        setRoleChangeModal={setRoleChangeModal}
        roleChangeForm={roleChangeForm}
        setRoleChangeForm={setRoleChangeForm}
        showNotification={showNotification}
        currentUser={currentUser}
        promoteToAdmin={promoteToAdmin}
        demoteFromAdmin={demoteFromAdmin}
      />
    </>
  );
};

export default UserManagementPage;
