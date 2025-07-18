import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { getAllUsers } from "../../services/userService";
import { useRef } from "react";
import { getOrgInfo } from "../../services/orgInfoService";
import countriesAr from "../../helpers/countriesAr";

// --- Validation Schema ---
const donationSchema = yup
  .object({
    donorName: yup.string().required("اسم المتبرع مطلوب"),
    donorPhone: yup
      .string()
      .matches(/^\d{8,15}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    amount: yup
      .number()
      .typeError("الرجاء إدخال مبلغ صحيح")
      .positive("يجب أن يكون المبلغ أكبر من صفر")
      .required("المبلغ مطلوب"),
    campaignId: yup.string().required("الرجاء اختيار حملة"),
    status: yup
      .string()
      .oneOf(["pending", "completed", "failed"])
      .required("الرجاء اختيار حالة التبرع"),
    isAnonymous: yup.boolean().notRequired(),
    donationType: yup.string().oneOf(["one-time", "recurring"]).required(),
    recurringInterval: yup.string().when("donationType", {
      is: "recurring",
      then: (schema) =>
        schema
          .oneOf(["monthly", "yearly"])
          .required("الرجاء تحديد فترة التكرار"),
      otherwise: (schema) => schema.notRequired(),
    }),
    notes: yup.string(),
  })
  .required();

export default function AddDonationForm({ onCancel, onSubmit }) {
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [donorQuery, setDonorQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [customDonor, setCustomDonor] = useState("");
  const [amountPrefilled, setAmountPrefilled] = useState(false);
  const donorInputRef = useRef();
  const [orgInfo, setOrgInfo] = useState(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countriesAr[0]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(donationSchema),
    defaultValues: {
      donationType: "one-time",
      status: "completed", // Default to completed
    },
  });

  const donationType = watch("donationType");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, "campaigns"));
        const activeCampaigns = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(activeCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("فشل في تحميل الحملات.");
      }
    };
    fetchCampaigns();

    // Fetch users for donor dropdown
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();

    // Fetch org info for default recurring amount
    const fetchOrgInfo = async () => {
      try {
        const info = await getOrgInfo();
        setOrgInfo(info);
      } catch (error) {
        console.error("Error fetching org info:", error);
      }
    };
    fetchOrgInfo();
  }, []);

  // Filter users as the donorQuery changes
  useEffect(() => {
    if (!donorQuery) {
      setFilteredUsers([]);
      setSelectedDonor(null);
      return;
    }
    const q = donorQuery.toLowerCase();
    const matches = users.filter(
      (u) =>
        (u.displayName && u.displayName.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q))
    );
    setFilteredUsers(matches);
    // If exact match, select
    if (
      matches.length === 1 &&
      (matches[0].displayName?.toLowerCase() === q ||
        matches[0].name?.toLowerCase() === q ||
        matches[0].email?.toLowerCase() === q ||
        matches[0].phone?.toLowerCase() === q)
    ) {
      setSelectedDonor(matches[0]);
    } else {
      setSelectedDonor(null);
    }
  }, [donorQuery, users]);

  // When donationType is monthly/yearly, set campaign to 'general' and prefill amount from orgInfo if available
  useEffect(() => {
    if (donationType === "monthly" || donationType === "yearly") {
      setValue("campaignId", "general");
      // Prefill amount from orgInfo if available
      if (orgInfo && orgInfo.recurring && orgInfo.recurring[donationType]) {
        setValue("amount", orgInfo.recurring[donationType].amount);
        setAmountPrefilled(true);
      }
    } else if (donationType === "one-time") {
      // Clear auto-filled values for one-time
      setValue("amount", "");
      setValue("campaignId", "");
      setAmountPrefilled(false);
    }
  }, [donationType, orgInfo, setValue]);

  // Prefill amount if donor has recurring settings and donationType is monthly/yearly
  useEffect(() => {
    if (!selectedDonor) return;
    let recurring = selectedDonor.recurring || {};
    let type = donationType;
    if ((type === "monthly" || type === "yearly") && recurring[type]?.enabled) {
      setValue("amount", recurring[type].amount);
      setAmountPrefilled(true);
    } else {
      setAmountPrefilled(false);
    }
  }, [selectedDonor, donationType, setValue]);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("جاري إضافة التبرع...");
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const donationData = {
        donorName: data.isAnonymous ? "فاعل خير" : data.donorName,
        donorPhone: data.donorPhone,
        amount: data.amount,
        campaign: data.campaignId,
        notes: data.notes || "",
        isAnonymous: data.isAnonymous || false,
        currency: "SDG",
        paymentMethod: "manual_entry",
        status: data.status, // Use the selected status
        recurringDonation: data.donationType === "recurring",
        recurringInterval:
          data.donationType === "recurring" ? data.recurringInterval : null,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "admin_manual_entry",
        donorId: selectedDonor ? selectedDonor.id : null, // Add donorId if selected
      };

      // If parent provided onSubmit, use it
      if (onSubmit) {
        await onSubmit(donationData);
      } else {
        // Fallback to internal submission
        await addDoc(collection(db, "donations"), donationData);
        // Update the campaign's raised/currentAmount field
        const campaignRef = doc(db, "campaigns", data.campaignId);
        // Try to increment 'raised', fallback to 'currentAmount' if 'raised' does not exist
        try {
          await updateDoc(campaignRef, {
            raised: increment(Number(data.amount)),
          });
        } catch (e) {
          await updateDoc(campaignRef, {
            currentAmount: increment(Number(data.amount)),
          });
        }
      }

      toast.success("تمت إضافة التبرع بنجاح!", { id: toastId });
      reset();
    } catch (err) {
      console.error("Donation submission error:", err);
      toast.error("حدث خطأ أثناء إضافة التبرع.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background-color)] p-4 sm:p-8" dir="rtl">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-[var(--background-color)] p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-6 relative"
        noValidate
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20 rounded-lg">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-white mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span className="text-white text-lg font-semibold">
                جاري إضافة التبرع...
              </span>
            </div>
          </div>
        )}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">
            إضافة تبرع جديد
          </h2>
          <p className="text-[var(--text-color-secondary)] mt-1">
            أدخل تفاصيل التبرع لإضافته إلى النظام.
          </p>
        </div>
        {/* Donation Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
            نوع التبرع
          </label>
          <div className="flex rounded-full p-1 border border-[var(--border-color)] bg-[var(--background-color)]">
            <label
              className={`w-1/2 text-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-full transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2
                ${
                  donationType === "one-time"
                    ? "bg-accent text-[var(--text-color)] shadow"
                    : "bg-[var(--background-color)] text-[var(--text-color)] border border-transparent hover:bg-[var(--background-color)]"
                }
              `}
              tabIndex={0}
            >
              <input
                type="radio"
                value="one-time"
                {...register("donationType")}
                className="sr-only"
              />
              مرة واحدة
            </label>
            <label
              className={`w-1/2 text-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-full transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2
                ${
                  donationType === "monthly"
                    ? "bg-accent text-[var(--text-color)] shadow"
                    : "bg-[var(--background-color)] text-[var(--text-color)] border border-transparent hover:bg-[var(--background-color)]"
                }
              `}
              tabIndex={0}
            >
              <input
                type="radio"
                value="monthly"
                {...register("donationType")}
                className="sr-only"
              />
              شهري
            </label>
            <label
              className={`w-1/2 text-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-full transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2
                ${
                  donationType === "yearly"
                    ? "bg-accent text-[var(--text-color)] shadow"
                    : "bg-[var(--background-color)] text-[var(--text-color)] border border-transparent hover:bg-[var(--background-color)]"
                }
              `}
              tabIndex={0}
            >
              <input
                type="radio"
                value="yearly"
                {...register("donationType")}
                className="sr-only"
              />
              سنوي
            </label>
          </div>
        </div>
        {/* Recurring Interval (Conditional) */}
        {donationType === "recurring" && (
          <div>
            <label
              htmlFor="recurringInterval"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              فترة التكرار
            </label>
            <select
              id="recurringInterval"
              {...register("recurringInterval")}
              className="input-field bg-[var(--background-color)] text-[var(--text-color)]"
            >
              <option value="">اختر الفترة...</option>
              <option value="monthly">شهرياً</option>
              <option value="yearly">سنوياً</option>
            </select>
            {errors.recurringInterval && (
              <p className="error-message">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donor Autocomplete */}
          <div className="relative">
            <label
              htmlFor="donorName"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              اسم المتبرع
            </label>
            <input
              id="donorName"
              type="text"
              ref={donorInputRef}
              value={donorQuery}
              onChange={(e) => {
                setDonorQuery(e.target.value);
                setCustomDonor("");
                setSelectedDonor(null);
                setValue("donorName", e.target.value);
              }}
              placeholder="ابحث بالاسم أو البريد أو الهاتف..."
              className="input-field bg-[var(--background-color)] text-[var(--text-color)]"
              autoComplete="off"
              disabled={donationType === "monthly" || donationType === "yearly"}
            />
            {/* Dropdown of matches */}
            {filteredUsers.length > 0 && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow max-h-40 overflow-y-auto mt-1">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700 text-[var(--text-color)] flex items-center gap-2"
                    onClick={() => {
                      setDonorQuery(
                        user.displayName ||
                          user.name ||
                          user.email ||
                          user.phone
                      );
                      setSelectedDonor(user);
                      setValue(
                        "donorName",
                        user.displayName ||
                          user.name ||
                          user.email ||
                          user.phone
                      );
                      setFilteredUsers([]);
                      if (user.phone) {
                        setValue("donorPhone", user.phone);
                      }
                    }}
                  >
                    {/* User image avatar */}
                    {user.photoURL || user.profileImage ? (
                      <img
                        src={user.photoURL || user.profileImage}
                        alt={user.displayName || user.name || "—"}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <span className="inline-block w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 mr-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </span>
                    )}
                    <span>
                      {user.displayName ||
                        user.name ||
                        user.email ||
                        user.phone}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {/* Show selected donor image next to name if selected */}
            {selectedDonor && donationType === "one-time" && (
              <div className="flex items-center gap-2 mt-2">
                {selectedDonor.photoURL || selectedDonor.profileImage ? (
                  <img
                    src={selectedDonor.photoURL || selectedDonor.profileImage}
                    alt={selectedDonor.displayName || selectedDonor.name || "—"}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <span className="inline-block w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 mr-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                )}
                <span className="text-[var(--text-color)] font-semibold">
                  {selectedDonor.displayName ||
                    selectedDonor.name ||
                    selectedDonor.email ||
                    selectedDonor.phone}
                </span>
              </div>
            )}
            {/* Manual entry if no match */}
            {filteredUsers.length === 0 && donorQuery && !selectedDonor && (
              <input
                type="text"
                placeholder="أدخل اسم المتبرع يدويًا"
                className="input-field bg-[var(--background-color)] text-[var(--text-color)] mt-2"
                value={customDonor}
                onChange={(e) => {
                  setCustomDonor(e.target.value);
                  setValue("donorName", e.target.value);
                }}
                required
                disabled={
                  donationType === "monthly" || donationType === "yearly"
                }
              />
            )}
            {errors.donorName && (
              <p className="error-message">{errors.donorName.message}</p>
            )}
          </div>
          {/* Donor Phone with Country Select */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
              الدولة ورقم هاتف المتبرع
            </label>
            <div className="flex gap-2 items-center">
              {/* Searchable country select */}
              <div className="relative w-2/5">
                <input
                  type="text"
                  placeholder="ابحث عن الدولة..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="input-field bg-[var(--background-color)] text-[var(--text-color)] mb-1"
                />
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow max-h-40 overflow-y-auto mt-1">
                  {countriesAr
                    .filter(
                      (c) =>
                        c.nameAr.includes(countrySearch) ||
                        c.nameEn
                          .toLowerCase()
                          .includes(countrySearch.toLowerCase())
                    )
                    .map((c) => (
                      <li
                        key={c.code}
                        className={`px-3 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700 ${
                          selectedCountry.code === c.code
                            ? "bg-primary-100 dark:bg-primary-700"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedCountry(c);
                          setCountrySearch(c.nameAr);
                        }}
                      >
                        {c.nameAr} ({c.phone})
                      </li>
                    ))}
                </ul>
              </div>
              {/* Phone code */}
              <span className="px-2 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                {selectedCountry.phone}
              </span>
              {/* Phone input */}
              <input
                id="donorPhone"
                type="tel"
                {...register("donorPhone")}
                className="input-field bg-[var(--background-color)] text-[var(--text-color)] flex-1"
                pattern="[0-9]{8,15}"
                inputMode="tel"
                placeholder="رقم الهاتف بدون رمز الدولة"
                disabled={
                  donationType === "monthly" || donationType === "yearly"
                }
              />
            </div>
            {errors.donorPhone && (
              <p className="error-message">{errors.donorPhone.message}</p>
            )}
          </div>
          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              المبلغ (بالجنيه السوداني)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
              className="input-field bg-[var(--background-color)] text-[var(--text-color)]"
              value={amountPrefilled ? watch("amount") : undefined}
              onChange={(e) => {
                setAmountPrefilled(false);
                setValue("amount", e.target.value);
              }}
              disabled={donationType === "monthly" || donationType === "yearly"}
            />
            {errors.amount && (
              <p className="error-message">{errors.amount.message}</p>
            )}
          </div>
          {/* Campaign */}
          <div>
            <label
              htmlFor="campaignId"
              className="block text-sm  font-medium text-[var(--text-color)] mb-1"
            >
              الحملة المستهدفة
            </label>
            <div className="relative">
              <select
                id="campaignId"
                {...register("campaignId")}
                className="input-field text-center block w-full px-4 py-2 pr-10 rounded-lg border border-primary-green focus:border-primary-green focus:ring focus:ring-primary-green/30 focus:ring-opacity-50 bg-[var(--background-color)] dark:bg-[var(--background-color)] text-[var(--text-color)] appearance-none transition font-semibold shadow-sm"
                disabled={
                  donationType === "monthly" || donationType === "yearly"
                }
              >
                <option value="">اختر حملة...</option>
                <option value="general">عام</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-primary-green">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.campaignId && (
              <p className="error-message">{errors.campaignId.message}</p>
            )}
          </div>
          {/* Status */}
        </div>
        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-[var(--text-color)] mb-1"
          >
            ملاحظات (اختياري)
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={3}
            className="input-field bg-[var(--background-color)] text-[var(--text-color)]"
          ></textarea>
        </div>
        {/* Anonymous Checkbox */}
        <div className="flex items-center">
          <input
            id="isAnonymous"
            type="checkbox"
            {...register("isAnonymous")}
            className="h-4 w-4 rounded border-primary-green text-primary-green focus:ring-primary-green ml-3"
          />
          <label
            htmlFor="isAnonymous"
            className="text-sm text-[var(--text-color)]"
          >
            تسجيل التبرع كـ "فاعل خير"
          </label>
        </div>
        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#3cc400] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#216c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-colors disabled:bg-neutral-medium disabled:cursor-not-allowed"
          >
            {isLoading ? "جاري الإضافة..." : "إضافة التبرع"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto bg-[#ef4444] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444] transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
      {/* Basic CSS classes for reuse - can be moved to index.css */}
      <style>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #BDC3C7;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #4A90E2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        .error-message {
          color: #CE1126;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
