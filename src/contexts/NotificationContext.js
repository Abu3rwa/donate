import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    if (notification.showToast !== false) {
      switch (notification.type) {
        case "success":
          toast.success(notification.message);
          break;
        case "error":
          toast.error(notification.message);
          break;
        case "warning":
          toast(notification.message, {
            icon: "⚠️",
            style: {
              background: "#F7931E",
              color: "#fff",
            },
          });
          break;
        default:
          toast(notification.message);
      }
    }

    return id;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  // Add emergency alert
  const addEmergencyAlert = (alert) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      timestamp: new Date(),
      dismissed: false,
      ...alert,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Show emergency toast
    toast(alert.message, {
      icon: "🚨",
      duration: 10000,
      style: {
        background: "#E74C3C",
        color: "#fff",
        fontWeight: "bold",
      },
    });

    return id;
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  // Remove dismissed alerts
  const removeDismissedAlerts = () => {
    setAlerts((prev) => prev.filter((alert) => !alert.dismissed));
  };

  // Get active alerts
  const getActiveAlerts = () => {
    return alerts.filter((alert) => !alert.dismissed);
  };

  // Success notification helper
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: "success",
      message,
      ...options,
    });
  };

  // Error notification helper
  const showError = (message, options = {}) => {
    return addNotification({
      type: "error",
      message,
      ...options,
    });
  };

  // Warning notification helper
  const showWarning = (message, options = {}) => {
    return addNotification({
      type: "warning",
      message,
      ...options,
    });
  };

  // Info notification helper
  const showInfo = (message, options = {}) => {
    return addNotification({
      type: "info",
      message,
      ...options,
    });
  };

  // Donation success notification
  const showDonationSuccess = (amount, currency = "SDG") => {
    return showSuccess(
      `شكراً لك على تبرعك بمبلغ ${amount} ${currency} لأهالي السعاتة الدومة!`,
      {
        title: "تبرع ناجح",
        action: {
          label: "عرض التفاصيل",
          onClick: () => (window.location.href = "/dashboard"),
        },
      }
    );
  };

  // Volunteer application success
  const showVolunteerSuccess = () => {
    return showSuccess("تم تقديم طلب التطوع بنجاح! سنتواصل معك قريباً.", {
      title: "طلب التطوع",
    });
  };

  // Story published notification
  const showStoryPublished = (storyTitle) => {
    return showSuccess(`تم نشر القصة "${storyTitle}" بنجاح!`, {
      title: "قصة منشورة",
    });
  };

  // Network error notification
  const showNetworkError = () => {
    return showError("حدث خطأ في الاتصال بالشبكة. يرجى المحاولة مرة أخرى.", {
      title: "خطأ في الشبكة",
      retry: true,
    });
  };

  // Authentication error notification
  const showAuthError = (errorCode) => {
    let message = "حدث خطأ في المصادقة";

    switch (errorCode) {
      case "auth/user-not-found":
        message = "البريد الإلكتروني غير مسجل";
        break;
      case "auth/wrong-password":
        message = "كلمة المرور غير صحيحة";
        break;
      case "auth/email-already-in-use":
        message = "البريد الإلكتروني مستخدم بالفعل";
        break;
      case "auth/weak-password":
        message = "كلمة المرور ضعيفة جداً";
        break;
      case "auth/invalid-email":
        message = "البريد الإلكتروني غير صحيح";
        break;
      default:
        message = "حدث خطأ في تسجيل الدخول";
    }

    return showError(message, {
      title: "خطأ في المصادقة",
    });
  };

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const value = {
    notifications,
    alerts,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadCount,
    addEmergencyAlert,
    dismissAlert,
    removeDismissedAlerts,
    getActiveAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDonationSuccess,
    showVolunteerSuccess,
    showStoryPublished,
    showNetworkError,
    showAuthError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
