import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ADMIN_PERMISSIONS } from "../../contexts/AuthContext";
import PERMISSIONS_AR from "../../helpers/permissionsMap";
import { getAuth } from "firebase/auth";
import {
  createUserDocument,
  createUserByAdmin,
} from "../../services/userService";
import toast from "react-hot-toast";
import { useEffect } from "react";

const userSchema = yup
  .object({
    firstName: yup.string().required("الاسم الأول مطلوب"),
    lastName: yup.string().required("اسم العائلة مطلوب"),
    email: yup
      .string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    phone: yup
      .string()
      .matches(/^\d{8,15}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    password: yup.string().required("كلمة المرور مطلوبة"),
    role: yup
      .string()
      .oneOf(["مسؤول", "محرر", "مشاهد"])
      .required("الدور مطلوب"),
    adminType: yup.string().when("role", {
      is: (val) => val === "مسؤول",
      then: (schema) => schema.required("نوع المسؤول مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
    photoURL: yup.string().url("رابط صورة غير صالح").nullable().notRequired(),
  })
  .required();

// Helper to generate a random numeric password
function generateEasyPassword(length = 8) {
  const numbers = "0123456789";
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return pwd;
}

const FORM_STORAGE_KEY = "addUserForm_unsaved";

export default function AddUserForm({ onCancel, onUserAdded, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  // Load persisted form data if available
  const persistedData = React.useMemo(() => {
    if (initialData) return initialData;
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: persistedData,
  });

  // Persist form data on change
  const watchedFields = watch();
  React.useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(watchedFields));
      } catch {}
    }
  }, [watchedFields, isLoading]);

  const role = watch("role");
  const adminType = watch("adminType");
  const [permissions, setPermissions] = useState(() => {
    if (initialData && initialData.permissions) return initialData.permissions;
    if (initialData && initialData.adminType)
      return ADMIN_PERMISSIONS[initialData.adminType]?.permissions || [];
    return [];
  });

  // When adminType changes, update permissions to default for that role
  useEffect(() => {
    if (role === "مسؤول" && adminType) {
      setPermissions(ADMIN_PERMISSIONS[adminType]?.permissions || []);
    }
  }, [adminType, role]);

  // All unique permissions
  const allPermissions = Array.from(
    new Set(Object.values(ADMIN_PERMISSIONS).flatMap((p) => p.permissions))
  ).filter((p) => p !== "all");

  const onSubmit = async (data) => {
    setIsLoading(true);
    const auth = getAuth();
    if (!auth.currentUser) {
      toast.error("يجب تسجيل الدخول أولاً");
      setIsLoading(false);
      return;
    }
    try {
      const now = new Date();
      const timestamp = now.toISOString();
      const isAdmin = data.role === "مسؤول" && data.adminType;
      const adminPerm = isAdmin ? ADMIN_PERMISSIONS[data.adminType] : null;
      // Prepare all user fields for Firestore
      const userProfile = {
        displayName: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        photoURL: data.photoURL || null,
        isActive: true,
        lastLogin: timestamp,
        lastUpdated: timestamp,
        createdAt: timestamp,
        registrationDate: timestamp,
        source: "website",
        status: "Active",
        role:
          data.role === "مسؤول"
            ? ADMIN_PERMISSIONS[data.adminType]?.name || "مدير"
            : data.role,
        adminType: isAdmin ? data.adminType : null,
        adminLevel: isAdmin ? adminPerm?.level : 0,
        permissions: isAdmin ? permissions : [],
        emailVerified: false,
      };
      if (initialData && (initialData.uid || initialData.id)) {
        // Editing existing user logic...
        setIsLoading(false);
        return;
      }
      // Creating new user
      try {
        const result = await createUserByAdmin(userProfile);
        const finalUserProfile = { ...userProfile, id: result.id };
        toast.success("تم إنشاء المستخدم بنجاح!");
        onUserAdded(finalUserProfile);
        reset();
        onCancel();
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (err) {
        console.error("❌ Failed to create user:", err);
        toast.error(`فشل إنشاء المستخدم: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("حدث خطأ غير متوقع");
      setIsLoading(false);
    }
  };

  return (
    <form
      className="space-y-6 p-4 py-8"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          إضافة مستخدم جديد
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          أدخل تفاصيل المستخدم لمنحه الوصول للنظام.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            الاسم الأول
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className="input-field"
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            اسم العائلة
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className="input-field"
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="input-field"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          رقم الهاتف
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="input-field"
          pattern="[0-9]{8,15}"
          inputMode="tel"
        />
        {errors.phone && (
          <p className="error-message">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="photoURL"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          رابط صورة المستخدم (اختياري)
        </label>
        <input
          id="photoURL"
          type="url"
          {...register("photoURL")}
          className="input-field"
        />
        {errors.photoURL && (
          <p className="error-message">{errors.photoURL.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          كلمة المرور
        </label>
        <div className="flex gap-2">
          <input
            id="password"
            type="text"
            {...register("password")}
            className="input-field flex-1"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="rounded bg-indigo-500 text-white px-3 py-1 text-xs font-semibold hover:bg-indigo-700 transition-colors"
            onClick={() => setValue("password", generateEasyPassword(6))}
            tabIndex={-1}
          >
            توليد كلمة مرور
          </button>
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          الدور
        </label>
        <select
          id="role"
          {...register("role")}
          className="input-field text-center"
        >
          <option value="مشاهد">مشاهد</option>
          <option value="محرر">محرر</option>
          <option value="مسؤول">مسؤول</option>
        </select>
        {errors.role && <p className="error-message">{errors.role.message}</p>}
      </div>
      {role === "مسؤول" && (
        <>
          <div>
            <label
              htmlFor="adminType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              نوع المسؤول
            </label>
            <select
              id="adminType"
              {...register("adminType")}
              className="input-field text-center"
            >
              <option value="">اختر نوع المسؤول...</option>
              {Object.entries(ADMIN_PERMISSIONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
            {errors.adminType && (
              <p className="error-message">{errors.adminType.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              الصلاحيات
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allPermissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPermissions((prev) => [...prev, perm]);
                      } else {
                        setPermissions((prev) =>
                          prev.filter((p) => p !== perm)
                        );
                      }
                    }}
                  />
                  {PERMISSIONS_AR[perm] || perm}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
        </button>
      </div>
      <style>{`
        .input-field { display: block; width: 100%; padding: 0.65rem 0.75rem; border-radius: 0.5rem; border: 1px solid #D1D5DB; background-color: #F9FAFB; color: #111827; transition: border-color 0.2s; }
        .dark .input-field { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }
        .input-field:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2); }
        .error-message { color: #EF4444; font-size: 0.875rem; margin-top: 0.5rem; }
      `}</style>
    </form>
  );
}
