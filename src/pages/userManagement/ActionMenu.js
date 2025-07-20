import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, Menu, KeyRound, LogOut, Mail, Eye } from "lucide-react";
import {
  resetPasswordByAdminCloud,
  signOutUserByAdminCloud,
  sendPasswordResetEmailByAdminCloud,
} from "../../services/userService";
import "./userManagement.css";

const ActionMenu = ({
  user,
  handleEdit,
  setDeleteConfirm,
  showNotification,
  onShowUserDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Wrapper to perform action and close menu
  const handleActionClick = async (action) => {
    await action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="إجراءات"
        className="open-menu-btn"
      >
        <Menu className="h-4 w-4" />
      </button>
      {isOpen && (
        <ul className="user-actions-menu text-right" dir="rtl">
          <li>
            <button
              onClick={() => handleActionClick(() => onShowUserDetails(user))}
              className="user-actions-item"
            >
              <Eye className="h-4 w-4" />
              التفاصيل
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActionClick(() => handleEdit(user))}
              className="user-actions-item info"
            >
              <Edit className="h-4 w-4" /> تعديل
            </button>
          </li>
          <li>
            <button
              onClick={() => handleActionClick(() => setDeleteConfirm(user))}
              className="user-actions-item danger"
            >
              <Trash2 className="h-4 w-4" /> حذف
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleActionClick(async () => {
                  const newPassword = prompt(
                    "أدخل كلمة مرور جديدة لهذا المستخدم (6 أحرف على الأقل):"
                  );
                  if (newPassword && newPassword.length >= 6) {
                    try {
                      await resetPasswordByAdminCloud({
                        userId: user.id || user.uid,
                        newPassword,
                      });
                      showNotification(
                        "تم إعادة تعيين كلمة المرور بنجاح",
                        "success"
                      );
                    } catch (err) {
                      showNotification(
                        `فشل في إعادة تعيين كلمة المرور: ${err.message || ""}`,
                        "error"
                      );
                    }
                  } else if (newPassword) {
                    showNotification(
                      "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                      "error"
                    );
                  }
                })
              }
              className="user-actions-item warning"
            >
              <KeyRound className="h-4 w-4" /> كلمة المرور
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleActionClick(async () => {
                  if (
                    window.confirm(
                      "هل أنت متأكد أنك تريد تسجيل خروج هذا المستخدم من جميع الأجهزة؟"
                    )
                  ) {
                    try {
                      await signOutUserByAdminCloud({
                        userId: user.id || user.uid,
                      });
                      showNotification(
                        "تم تسجيل خروج المستخدم بنجاح",
                        "success"
                      );
                    } catch (err) {
                      showNotification(
                        `فشل في تسجيل خروج المستخدم: ${err.message || ""}`,
                        "error"
                      );
                    }
                  }
                })
              }
              className="user-actions-item"
            >
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleActionClick(async () => {
                  try {
                    const result = await sendPasswordResetEmailByAdminCloud({
                      email: user.email,
                    });
                    if (result && result.link) {
                      await navigator.clipboard.writeText(result.link);
                      showNotification("تم نسخ الرابط!", "success");
                    } else {
                      showNotification("تم إنشاء الرابط.", "success");
                    }
                  } catch (err) {
                    showNotification(
                      `فشل في إرسال الرابط: ${err.message || ""}`,
                      "error"
                    );
                  }
                })
              }
              className="user-actions-item success"
            >
              <Mail className="h-4 w-4" /> رابط
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ActionMenu;
