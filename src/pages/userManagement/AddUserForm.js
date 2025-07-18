import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ADMIN_PERMISSIONS } from "../../contexts/AuthContext";
import PERMISSIONS_AR from "../../helpers/permissionsMap";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import {
  createUserByAdminCloud,
  updateUserById,
} from "../../services/userService";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { uploadFile } from "../../services/fileUploadService";
import countriesAr from "../../helpers/countriesAr";

const userSchema = yup
  .object({
    displayName: yup.string().required("الاسم مطلوب"),
    email: yup
      .string()
      .email("البريد الإلكتروني غير صالح")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "البريد الإلكتروني يحتوي على أحرف غير صالحة"
      )
      .required("البريد الإلكتروني مطلوب"),
    phone: yup
      .string()
      // .matches(/^(\+|00)\d{8,20}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    password: yup.string().when("$isEdit", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("كلمة المرور مطلوبة"),
    }),
    role: yup
      .string()
      .oneOf(["مسؤول", "محرر", "مشاهد"])
      .required("الدور مطلوب"),
    adminType: yup.string().when("role", {
      is: "مسؤول",
      then: (schema) => schema.required("نوع المسؤول مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
    homeCountry: yup.string().required("الدولة الأصلية مطلوبة"),
    currentCountry: yup.string().required("الدولة الحالية مطلوبة"),
    profileImage: yup.mixed().notRequired(),
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
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
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
    context: { isEdit: !!initialData },
    defaultValues: persistedData,
  });

  // Handle profile image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setProfileImagePreview(null);
    }
  };

  // Persist form data on change
  const watchedFields = watch();
  React.useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(watchedFields));
      } catch {}
    }
  }, [watchedFields, isLoading]);

  useEffect(() => {
    if (initialData) {
      // Home Country
      const homeCountryObj =
        countriesAr.find((c) => c.nameAr === initialData.homeCountry) ||
        countriesAr[0];
      setSelectedHomeCountry(homeCountryObj);
      setHomeCountrySearch(initialData.homeCountry || "");
      setValue("homeCountry", initialData.homeCountry || "");
      // Current Country
      const currentCountryObj =
        countriesAr.find((c) => c.nameAr === initialData.currentCountry) ||
        countriesAr[0];
      setSelectedCurrentCountry(currentCountryObj);
      setCurrentCountrySearch(initialData.currentCountry || "");
      setValue("currentCountry", initialData.currentCountry || "");
      // Phone
      setValue("phone", initialData.phone || "");
      // Add more fields as needed
    }
  }, [initialData, setValue]);

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

  const [homeCountrySearch, setHomeCountrySearch] = useState("");
  const [currentCountrySearch, setCurrentCountrySearch] = useState("");
  const [selectedHomeCountry, setSelectedHomeCountry] = useState(
    countriesAr[0]
  );
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState(
    countriesAr[0]
  );
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);

  const onSubmit = async (data) => {
    // Trim spaces from phone before validation and submission
    data.phone = data.phone.replace(/\s+/g, "");
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

      let uploadedImageUrl = initialData?.photoURL || null;
      if (profileImageFile) {
        let userId =
          initialData?.uid ||
          initialData?.id ||
          data.email.replace(/[^a-zA-Z0-9]/g, "_");
        try {
          uploadedImageUrl = await uploadFile(
            profileImageFile,
            `users/${userId}/profile.jpg`
          );
        } catch (err) {
          toast.error("فشل رفع صورة الملف الشخصي");
          setIsLoading(false);
          return;
        }
      }

      const userProfile = {
        displayName: data.displayName,
        email: data.email,
        phone: data.phone,
        photoURL: uploadedImageUrl,
        homeCountry: data.homeCountry,
        currentCountry: data.currentCountry,
        isActive: true,
        lastLogin: timestamp,
        lastUpdated: timestamp,
        createdAt: initialData?.createdAt || timestamp,
        registrationDate: initialData?.registrationDate || timestamp,
        source: "website",
        status: "Active",
        role:
          data.role === "مسؤول"
            ? ADMIN_PERMISSIONS[data.adminType]?.name || "مدير"
            : data.role,
        adminType: isAdmin ? data.adminType : null,
        adminLevel: isAdmin ? adminPerm?.level : 0,
        permissions: isAdmin ? permissions : [],
        emailVerified: initialData?.emailVerified || false,
      };

      if (initialData && (initialData.uid || initialData.id)) {
        // Update existing user
        const userId = initialData.uid || initialData.id;
        await updateUserById(userId, userProfile);
        toast.success("تم تحديث المستخدم بنجاح!");
        onUserAdded({ ...userProfile, id: userId });
      } else {
        // Create new user as admin
        const result = await createUserByAdminCloud({
          ...userProfile,
          password: data.password,
        });
        toast.success("تم إنشاء المستخدم بنجاح!");
        onUserAdded({ ...userProfile, id: result.uid });
      }

      reset();
      onCancel();
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (err) {
      console.error("❌ Failed to create/update user:", err);
      toast.error(`فشل العملية: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="space-y-6 p-4 py-8"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Form content remains the same... */}
      <div className="text-center gradient-accent rounded-lg py-6 mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white/20">
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
        <h3 className="mt-4 text-xl font-semibold text-white">
          {initialData ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
        </h3>
        <p className="mt-1 text-sm text-white/80">
          أدخل تفاصيل المستخدم لمنحه الوصول للنظام.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          صورة الملف الشخصي
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="input-field"
        />
        {profileImagePreview && (
          <img
            src={profileImagePreview}
            alt="معاينة الصورة"
            className="mt-2 rounded-full w-20 h-20 object-cover border"
          />
        )}
      </div>
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          الاسم الكامل
        </label>
        <input
          id="displayName"
          type="text"
          {...register("displayName")}
          className="input-field"
        />
        {errors.displayName && (
          <p className="error-message">{errors.displayName.message}</p>
        )}
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
          disabled={!!initialData}
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
          رقم الهاتف (مع رمز الدولة)
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="input-field"
          inputMode="tel"
          placeholder="مثال: +249xxxxxxxxx أو 00249xxxxxxxxx"
        />
        {errors.phone && (
          <p className="error-message">{errors.phone.message}</p>
        )}
      </div>
      {!initialData && (
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
              onClick={() => setValue("password", generateEasyPassword(8))}
              tabIndex={-1}
            >
              توليد كلمة مرور
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>
      )}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Home Country */}
        <div>
          <label
            htmlFor="homeCountry"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            الدولة الأصلية
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن الدولة..."
              value={homeCountrySearch}
              onFocus={() => setShowHomeDropdown(true)}
              onBlur={() => setTimeout(() => setShowHomeDropdown(false), 150)}
              onChange={(e) => {
                setHomeCountrySearch(e.target.value);
                setShowHomeDropdown(true);
              }}
              className="input-field bg-[var(--background-color)] text-[var(--text-color)] mb-1"
            />
            {showHomeDropdown && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow max-h-40 overflow-y-auto mt-1">
                {countriesAr
                  .filter(
                    (c) =>
                      c.nameAr.includes(homeCountrySearch) ||
                      c.nameEn
                        .toLowerCase()
                        .includes(homeCountrySearch.toLowerCase())
                  )
                  .map((c) => (
                    <li
                      key={c.code}
                      className={`px-3 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700`}
                      onMouseDown={() => {
                        setSelectedHomeCountry(c);
                        setHomeCountrySearch(c.nameAr);
                        setValue("homeCountry", c.nameAr);
                        setShowHomeDropdown(false);
                      }}
                    >
                      {c.nameAr}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {errors.homeCountry && (
            <p className="error-message">{errors.homeCountry.message}</p>
          )}
        </div>
        {/* Current Country */}
        <div>
          <label
            htmlFor="currentCountry"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            الدولة الحالية
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن الدولة..."
              value={currentCountrySearch}
              onFocus={() => setShowCurrentDropdown(true)}
              onBlur={() =>
                setTimeout(() => setShowCurrentDropdown(false), 150)
              }
              onChange={(e) => {
                setCurrentCountrySearch(e.target.value);
                setShowCurrentDropdown(true);
              }}
              className="input-field bg-[var(--background-color)] text-[var(--text-color)] mb-1"
            />
            {showCurrentDropdown && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow max-h-40 overflow-y-auto mt-1">
                {countriesAr
                  .filter(
                    (c) =>
                      c.nameAr.includes(currentCountrySearch) ||
                      c.nameEn
                        .toLowerCase()
                        .includes(currentCountrySearch.toLowerCase())
                  )
                  .map((c) => (
                    <li
                      key={c.code}
                      className={`px-3 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700`}
                      onMouseDown={() => {
                        setSelectedCurrentCountry(c);
                        setCurrentCountrySearch(c.nameAr);
                        setValue("currentCountry", c.nameAr);
                        setShowCurrentDropdown(false);
                      }}
                    >
                      {c.nameAr}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {errors.currentCountry && (
            <p className="error-message">{errors.currentCountry.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 btn btn-danger"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary gradient-accent"
        >
          {isLoading
            ? initialData
              ? "جاري التحديث..."
              : "جاري الإنشاء..."
            : initialData
            ? "تحديث المستخدم"
            : "إنشاء المستخدم"}
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
