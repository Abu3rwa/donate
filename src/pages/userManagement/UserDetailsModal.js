import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import PERMISSIONS_AR from "../../helpers/permissionsMap";
import { getRoleColor } from "./UserManagementHelpers";
import styles from "./UserDetailsModal.module.css";

const UserDetailsModal = ({
  user,
  onClose,
  isVisible = true,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (e) => e.key === "Escape" && onClose();
    const handleClickOutside = (e) =>
      modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    closeBtnRef.current && closeBtnRef.current.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isVisible]);

  if (!user || !isVisible) return null;

  const displayName = user.displayName || user.name;
  const avatar = user.photoURL ? (
    <div className={styles.avatarContainer}>
      <img
        src={user.photoURL}
        alt={displayName ? `صورة ${displayName}` : "صورة المستخدم"}
        className={styles.avatar}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div className={styles.avatarFallback} style={{ display: "none" }}>
        {displayName ? displayName.charAt(0).toUpperCase() : "م"}
      </div>
    </div>
  ) : (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarFallback}>
        {displayName ? displayName.charAt(0).toUpperCase() : "م"}
      </div>
    </div>
  );

  const status = user.disabled
    ? "معطل"
    : user.emailVerified === false
    ? "بريد غير مؤكد"
    : "نشط";
  const statusClass =
    status === "نشط"
      ? styles.statusActive
      : status === "معطل"
      ? styles.statusDisabled
      : styles.statusUnverified;

  const role = user.role || user.adminType;
  const roleLabel = role
    ? { admin: "مدير", user: "مستخدم", moderator: "مشرف", editor: "محرر" }[
        role.toLowerCase()
      ] || role
    : "مستخدم";

  const formatDate = (d) => {
    if (!d) return "غير متوفر";
    const date = new Date(d);
    return isNaN(date.getTime())
      ? "غير متوفر"
      : date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const permissions = !user.permissions ? (
    <span className={styles.noPermissions}>لا يوجد</span>
  ) : user.permissions.includes("all") ? (
    <span className={styles.allPermissions}>كل الصلاحيات</span>
  ) : user.permissions.length === 0 ? (
    <span className={styles.noPermissions}>لا يوجد</span>
  ) : (
    <div className={styles.permissionsContainer}>
      <ul className={styles.permissionsList} role="list">
        {user.permissions.map((p, i) => (
          <li key={p + i} className={styles.permissionItem}>
            {PERMISSIONS_AR[p] || p}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          {avatar}
          <div className={styles.headerContent}>
            <h2 id="modal-title" className={styles.modalTitle}>
              {displayName || "مستخدم غير محدد"}
            </h2>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {status}
            </span>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            ref={closeBtnRef}
            aria-label="إغلاق النافذة"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className={styles.divider} role="separator"></div>
        <div className={styles.body}>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>المعلومات الأساسية</h3>
            <div className={styles.infoRow}>
              <span className={styles.label}>الاسم الكامل:</span>
              <span className={styles.value}>{displayName || "غير متوفر"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>البريد الإلكتروني:</span>
              <span className={styles.value}>
                {user.email || "غير متوفر"}
                {user.emailVerified && (
                  <span className={styles.verifiedBadge} title="بريد مؤكد">
                    ✓
                  </span>
                )}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>رقم الهاتف:</span>
              <span className={styles.value}>{user.phone || "غير متوفر"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>معرف المستخدم:</span>
              <span className={styles.value}>
                <code className={styles.userId}>
                  {user.uid || user.id || "غير متوفر"}
                </code>
              </span>
            </div>
          </div>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>الأدوار والصلاحيات</h3>
            <div className={styles.infoRow}>
              <span className={styles.label}>الدور:</span>
              <span
                className={`${styles.roleBadge} ${getRoleColor(
                  user.adminType || user.role
                )}`}
              >
                {roleLabel}
              </span>
            </div>
            {(user.adminType || user.permissions) && (
              <div className={styles.infoRow}>
                <span className={styles.label}>الصلاحيات:</span>
                <div className={styles.permissionsWrapper}>{permissions}</div>
              </div>
            )}
          </div>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>معلومات الحساب</h3>
            <div className={styles.infoRow}>
              <span className={styles.label}>تاريخ الإنشاء:</span>
              <span className={styles.value}>
                {formatDate(user.creationTime)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>آخر تسجيل دخول:</span>
              <span className={styles.value}>
                {formatDate(user.lastSignInTime)}
              </span>
            </div>
            {user.customClaims && Object.keys(user.customClaims).length > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.label}>معلومات إضافية:</span>
                <div className={styles.customClaims}>
                  {Object.entries(user.customClaims).map(([k, v]) => (
                    <div key={k} className={styles.claimItem}>
                      <span className={styles.claimKey}>{k}:</span>
                      <span className={styles.claimValue}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={styles.closeModalButton}
            autoFocus
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

UserDetailsModal.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    id: PropTypes.string,
    displayName: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photoURL: PropTypes.string,
    role: PropTypes.string,
    adminType: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    creationTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastSignInTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    emailVerified: PropTypes.bool,
    disabled: PropTypes.bool,
    customClaims: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
};

export default UserDetailsModal;
