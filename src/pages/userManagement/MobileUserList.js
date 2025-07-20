import React from "react";
import styles from "./MobileUserList.module.css";
import PropTypes from "prop-types";
import MemberOfficeRoleBadge from "./MemberOfficeRoleBadge";

const MobileUserList = ({
  onShowDetails,
  filteredUsers = [],
  onEdit,
  onDelete,
  onSignOut,
}) => {
  // Delete user handler
  const handleDelete = (user) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
      if (typeof onDelete === "function") {
        onDelete(user);
      }
    }
  };

  // Edit user handler
  const handleEdit = (user) => {
    if (typeof onEdit === "function") {
      onEdit(user);
    }
  };

  // Sign out user handler
  const handleSignOut = (user) => {
    if (window.confirm("هل تريد تسجيل خروج هذا المستخدم؟")) {
      if (typeof onSignOut === "function") {
        onSignOut(user);
      }
    }
  };

  return (
    <div className={styles.mobileListContainer} dir="rtl">
      {filteredUsers.length === 0 ? (
        <div className={styles.emptyState}>لا يوجد مستخدمون</div>
      ) : (
        <ul className={styles.userList}>
          {filteredUsers.map((user) => (
            <li key={user.id || user.uid} className={styles.userCard}>
              <div className={styles.header} dir="rtl">
                <div className={styles.avatarWrapper}>
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.name || "User Avatar"}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h5 className={styles.userName}>
                    {user.displayName || user.name || "مستخدم غير معروف"}
                  </h5>
                  {user.phone && (
                    <span className={styles.userEmail}>{user.phone}</span>
                  )}
                </div>
              </div>
              <MemberOfficeRoleBadge memberOfficeRole={user.memberOfficeRole} />
              <div className={styles.actions}>
                <button
                  className={styles.detailsButton}
                  onClick={() => onShowDetails(user)}
                  aria-label="تفاصيل المستخدم"
                  title="تفاصيل المستخدم"
                >
                  تفاصيل
                </button>
                <button
                  className={styles.delete}
                  onClick={() => handleEdit(user)}
                  aria-label="تعديل المستخدم"
                  title="تعديل المستخدم"
                >
                  تعديل
                </button>
                <button
                  className={styles.edit}
                  onClick={() => handleDelete(user)}
                  aria-label="حذف المستخدم"
                  title="حذف المستخدم"
                >
                  حذف
                </button>
                <button
                  className={styles.signout}
                  onClick={() => handleSignOut(user)}
                  aria-label="تسجيل خروج المستخدم"
                  title="تسجيل خروج المستخدم"
                >
                  تسجيل خروج
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

MobileUserList.propTypes = {
  filteredUsers: PropTypes.array,
  onShowDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSignOut: PropTypes.func,
};

export default MobileUserList;
