import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Admin user types and levels
export const ADMIN_TYPES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  VOLUNTEER_COORDINATOR: "volunteer_coordinator",
  DONATION_MANAGER: "donation_manager",
  CAMPAIGN_MANAGER: "campaign_manager",
  FINANCE_MANAGER: "finance_manager",
  COMMUNICATION_MANAGER: "communication_manager",
  WEBSITE_ADMIN: "website_admin", // NEW
};

export const ADMIN_LEVELS = {
  LEVEL_1: 1, // Basic access - Volunteer Coordinator, Donation Manager
  LEVEL_2: 2, // Medium access - Campaign Manager, Communication Manager
  LEVEL_3: 3, // High access - Finance Manager, Moderator
  LEVEL_4: 4, // Full access - Admin
  LEVEL_5: 5, // Super access - Super Admin
};

export const ADMIN_PERMISSIONS = {
  [ADMIN_TYPES.SUPER_ADMIN]: {
    level: ADMIN_LEVELS.LEVEL_5,
    permissions: [
      "all",
      "manage_users",
      "manage_campaigns",
      "manage_donations",
      "manage_finances",
      "manage_volunteers",
      "view_reports",
      "moderate_content",
      "view_volunteer_reports",
      "view_donation_reports",
      "view_campaign_reports",
      "view_financial_reports",
      "manage_communications",
      "view_communication_reports",
      "website_admin", // NEW
    ],
    name: "المدير عام",
    description: "صلاحيات كاملة على النظام",
  },
  [ADMIN_TYPES.ADMIN]: {
    level: ADMIN_LEVELS.LEVEL_4,
    permissions: [
      "manage_users",
      "manage_campaigns",
      "manage_donations",
      "manage_finances",
      "manage_volunteers",
      "view_reports",
    ],
    name: "مدير",
    description: "إدارة شاملة للنظام",
  },
  [ADMIN_TYPES.MODERATOR]: {
    level: ADMIN_LEVELS.LEVEL_3,
    permissions: [
      "moderate_content",
      "view_reports", // عرض التقارير
      "view_volunteer_reports", // عرض تقارير المتطوعين
      "view_donation_reports", // عرض تقارير التبرعات
      "view_campaign_reports", // عرض تقارير الحملات
      "view_financial_reports", // عرض التقارير المالية
      "view_reports",
    ],
    name: "مشرف",
    description: "إشراف على المحتوى والمتطوعين",
  },
  [ADMIN_TYPES.VOLUNTEER_COORDINATOR]: {
    level: ADMIN_LEVELS.LEVEL_1,
    permissions: ["manage_volunteers", "view_volunteer_reports"],
    name: "منسق المتطوعين",
    description: "إدارة المتطوعين وتنسيقهم",
  },
  [ADMIN_TYPES.DONATION_MANAGER]: {
    level: ADMIN_LEVELS.LEVEL_1,
    permissions: ["manage_donations", "view_donation_reports"],
    name: "مدير التبرعات",
    description: "إدارة التبرعات والمتابعة",
  },
  [ADMIN_TYPES.CAMPAIGN_MANAGER]: {
    level: ADMIN_LEVELS.LEVEL_2,
    permissions: ["manage_campaigns", "view_campaign_reports"],
    name: "مدير الحملات",
    description: "إدارة الحملات والتسويق",
  },
  [ADMIN_TYPES.FINANCE_MANAGER]: {
    level: ADMIN_LEVELS.LEVEL_3,
    permissions: [
      "manage_finances",
      "view_financial_reports",
      "manage_donations",
      "manage_donations", // إدارة التبرعات
      "manage_finances", // إدارة المالية
      "view_reports", // عرض التقارير
      "view_volunteer_reports", // عرض تقارير المتطوعين
      "view_donation_reports", // عرض تقارير التبرعات
      "view_campaign_reports", // عرض تقارير الحملات
      "view_financial_reports", // عرض التقارير المالية
    ],
    name: "مدير المالية",
    description: "إدارة الشؤون المالية",
  },
  [ADMIN_TYPES.COMMUNICATION_MANAGER]: {
    level: ADMIN_LEVELS.LEVEL_2,
    permissions: [
      "manage_communications",
      "moderate_content",
      "view_communication_reports",
    ],
    name: "مدير الاعلام",
    description: "إدارة التواصل والمحتوى",
  },
  [ADMIN_TYPES.WEBSITE_ADMIN]: {
    level: ADMIN_LEVELS.LEVEL_4,
    permissions: ["all"],
    name: "مسؤول الموقع",
    description: "إدارة الموقع والصلاحيات المرتبطة به",
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if Firebase Auth is properly configured
  useEffect(() => {
    const checkFirebaseAuth = async () => {
      try {
        // Check if auth object exists
        if (!auth) {
          setLoading(false);
          return;
        }

        // Test Firebase Auth connection
        const unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            if (firebaseUser) {
              // Get additional user data from Firestore
              try {
                const userDoc = await getDoc(
                  doc(db, "users", firebaseUser.uid)
                );
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  const mergedUser = {
                    ...firebaseUser,
                    ...userData,
                  };
                  setUser(mergedUser);
                } else {
                  setUser(firebaseUser);
                }
              } catch (error) {
                console.warn(
                  "Failed to fetch user data from Firestore:",
                  error
                );
                setUser(firebaseUser);
              }
            } else {
              setUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.warn("⚠️ Firebase Auth error:", error.message);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.warn("⚠️ Firebase Auth initialization failed:", error.message);
        setLoading(false);
      }
    };

    checkFirebaseAuth();
  }, []);

  // Helper functions for admin checks
  const isAdmin = (user) => {
    return (
      user &&
      user.adminType &&
      Object.values(ADMIN_TYPES).includes(user.adminType)
    );
  };

  const hasPermission = (user, permission) => {
    if (!isAdmin(user)) return false;

    const adminConfig = ADMIN_PERMISSIONS[user.adminType];
    return (
      adminConfig.permissions.includes("all") ||
      adminConfig.permissions.includes(permission)
    );
  };

  const getAdminLevel = (user) => {
    if (!isAdmin(user)) return 0;
    return ADMIN_PERMISSIONS[user.adminType].level;
  };

  const canAccessLevel = (user, requiredLevel) => {
    return getAdminLevel(user) >= requiredLevel;
  };

  const getAdminTypeInfo = (user) => {
    if (!isAdmin(user)) return null;
    return ADMIN_PERMISSIONS[user.adminType];
  };

  // Create user document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!db) {
      console.warn("Firestore not available");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName:
          user.displayName ||
          additionalData.firstName + " " + additionalData.lastName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        adminType: null, // Regular user by default
        adminLevel: 0,
        permissions: [],
        phone: additionalData.phone || "",
        firstName: additionalData.firstName || "",
        lastName: additionalData.lastName || "",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        role: "مستخدم", // Default role for new users
        ...additionalData,
      };

      await setDoc(userRef, userData);
      console.log("✅ User document created successfully");
      return userData;
    } catch (error) {
      console.error("❌ Failed to create user document:", error);
      throw error;
    }
  };

  // Update user document in Firestore
  const updateUserDocument = async (userId, updates) => {
    if (!db) {
      console.warn("Firestore not available");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
      console.log("✅ User document updated successfully");
    } catch (error) {
      console.error("❌ Failed to update user document:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time
      if (result.user) {
        await updateUserDocument(result.user.uid, {
          lastLogin: new Date().toISOString(),
        });
      }

      return result.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      if (userData.firstName || userData.lastName) {
        const displayName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();
        await updateProfile(result.user, { displayName });
      }

      // Create user document in Firestore
      const userDocument = await createUserDocument(result.user, userData);

      // Update local user state with Firestore data
      setUser({
        ...result.user,
        ...userDocument,
      });

      return result.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, updates);

      // Update Firestore document
      if (auth.currentUser) {
        await updateUserDocument(auth.currentUser.uid, updates);
      }

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        ...updates,
      }));
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  // Admin management functions
  const promoteToAdmin = async (userId, adminType, permissions = null) => {
    if (db) {
      try {
        const adminConfig = ADMIN_PERMISSIONS[adminType];
        if (!adminConfig) {
          throw new Error("Invalid admin type");
        }

        await updateUserDocument(userId, {
          adminType,
          adminLevel: adminConfig.level,
          permissions: permissions ?? adminConfig.permissions,
          promotedAt: new Date().toISOString(),
          promotedBy: user?.uid,
          role: adminConfig.name, // Always set Arabic role
        });

        // Update local state if it's the current user
        if (user?.uid === userId) {
          setUser((prevUser) => ({
            ...prevUser,
            adminType,
            adminLevel: adminConfig.level,
            permissions: permissions ?? adminConfig.permissions,
            role: adminConfig.name, // Update local state too
          }));
        }

        return true;
      } catch (error) {
        console.error("Failed to promote user to admin:", error);
        throw error;
      }
    }
  };

  const demoteFromAdmin = async (userId) => {
    if (db) {
      try {
        await updateUserDocument(userId, {
          adminType: null,
          adminLevel: 0,
          permissions: [],
          demotedAt: new Date().toISOString(),
          demotedBy: user?.uid,
          role: "مستخدم", // Always set Arabic role for regular user
        });

        // Update local state if it's the current user
        if (user?.uid === userId) {
          setUser((prevUser) => ({
            ...prevUser,
            adminType: null,
            adminLevel: 0,
            permissions: [],
            role: "مستخدم", // Update local state too
          }));
        }

        return true;
      } catch (error) {
        console.error("Failed to demote user from admin:", error);
        throw error;
      }
    }
  };

  // Fix admin level for existing users
  const fixAdminLevel = async (userId) => {
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.adminType && ADMIN_PERMISSIONS[userData.adminType]) {
            const correctLevel = ADMIN_PERMISSIONS[userData.adminType].level;
            const correctPermissions =
              ADMIN_PERMISSIONS[userData.adminType].permissions;

            await updateUserDocument(userId, {
              adminLevel: correctLevel,
              permissions: correctPermissions,
            });

            // Update local state if it's the current user
            if (user?.uid === userId) {
              setUser((prevUser) => ({
                ...prevUser,
                adminLevel: correctLevel,
                permissions: correctPermissions,
              }));
            }

            console.log(
              `✅ Fixed admin level for user ${userId}: ${correctLevel}`
            );
            return true;
          }
        }
      } catch (error) {
        console.error("Failed to fix admin level:", error);
        throw error;
      }
    }
  };

  // Force fix admin level immediately
  const forceFixAdminLevel = async (userId) => {
    if (db) {
      try {
        await updateUserDocument(userId, {
          adminLevel: 5,
          permissions: ["all"],
        });

        // Update local state if it's the current user
        if (user?.uid === userId) {
          setUser((prevUser) => ({
            ...prevUser,
            adminLevel: 5,
            permissions: ["all"],
          }));
        }

        console.log(`✅ Force fixed admin level for user ${userId} to 5`);
        return true;
      } catch (error) {
        console.error("Failed to force fix admin level:", error);
        throw error;
      }
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    resetPassword,
    isAdmin: () => isAdmin(user),
    hasPermission: (permission) => hasPermission(user, permission),
    getAdminLevel: () => getAdminLevel(user),
    canAccessLevel: (requiredLevel) => canAccessLevel(user, requiredLevel),
    getAdminTypeInfo: () => getAdminTypeInfo(user),
    promoteToAdmin,
    demoteFromAdmin,
    fixAdminLevel,
    forceFixAdminLevel,
    // Add other functions as needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
