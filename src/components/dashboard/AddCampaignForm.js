import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const campaignSchema = yup
  .object({
    name: yup.string().required("اسم الحملة مطلوب"),
    description: yup.string().required("الوصف مطلوب"),
    goal: yup
      .number()
      .typeError("الرجاء إدخال مبلغ صحيح")
      .positive("يجب أن يكون المبلغ أكبر من صفر")
      .required("المبلغ المستهدف مطلوب"),
    startDate: yup.string().required("تاريخ البدء مطلوب"),
    endDate: yup.string().required("تاريخ الانتهاء مطلوب"),
    raised: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? undefined : value
      )
      .typeError("الرجاء إدخال مبلغ صحيح")
      .min(0, "يجب أن يكون المبلغ أكبر أو يساوي صفر")
      .notRequired(),
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? undefined : value
      )
      .typeError("الرجاء إدخال مبلغ صحيح")
      .min(0, "يجب أن يكون المبلغ أكبر أو يساوي صفر")
      .notRequired(),
  })
  .required();

export default function AddCampaignForm({ onCancel, onSubmit: onSubmitProp, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAdminLevel, canAccessLevel } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: initialData || {},
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading(initialData ? "جاري تحديث الحملة..." : "جاري إضافة الحملة...");
    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }
      // Check if user has required admin level (level 2 or higher)
      const userAdminLevel = getAdminLevel();
      if (!canAccessLevel(2)) {
        throw new Error(`لا تملك الصلاحيات المطلوبة. المستوى المطلوب: 2، مستواك الحالي: ${userAdminLevel}`);
      }
      // Always delegate to parent handler
      if (onSubmitProp) {
        await onSubmitProp(data);
        reset();
        if (onCancel) onCancel();
        toast.success(initialData ? "تم تحديث الحملة بنجاح!" : "تمت إضافة الحملة بنجاح!", { id: toastId });
        return;
      } else {
        throw new Error("لم يتم توفير دالة المعالجة (onSubmit)");
      }
    } catch (err) {
      toast.error(`حدث خطأ: ${err.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-[var(--background-color)]" dir="rtl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        noValidate
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {initialData ? "تعديل حملة" : "إنشاء حملة جديدة"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            أدخل تفاصيل الحملة لإضافتها إلى النظام.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campaign Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">اسم الحملة</label>
            <input id="name" type="text" {...register("name")} className="input-field" />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
          {/* Goal Amount */}
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المبلغ المستهدف</label>
            <input id="goal" type="number" step="0.01" {...register("goal")} className="input-field" />
            {errors.goal && <p className="error-message">{errors.goal.message}</p>}
          </div>
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">الوصف</label>
          <textarea id="description" {...register("description")} rows={3} className="input-field" />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">تاريخ البدء</label>
            <input id="startDate" type="date" {...register("startDate")} className="input-field" />
            {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
          </div>
          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">تاريخ الانتهاء</label>
            <input id="endDate" type="date" {...register("endDate")} className="input-field" />
            {errors.endDate && <p className="error-message">{errors.endDate.message}</p>}
          </div>
        </div>
        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="raised" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المبلغ المجموع (اختياري)</label>
            <input id="raised" type="number" step="0.01" {...register("raised")} className="input-field" />
            {errors.raised && <p className="error-message">{errors.raised.message}</p>}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المبلغ الحالي (اختياري)</label>
            <input id="amount" type="number" step="0.01" {...register("amount")} className="input-field" />
            {errors.amount && <p className="error-message">{errors.amount.message}</p>}
          </div>
        </div>
        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#3cc400] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#216c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-colors disabled:bg-neutral-medium disabled:cursor-not-allowed"
          >
            {isLoading ? (initialData ? "جاري التحديث..." : "جاري الإضافة...") : (initialData ? "تحديث الحملة" : "إنشاء الحملة")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto bg-[#ef4444] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444] transition-colors"
          >
            إلغاء
          </button>
        </div>
        <style>{`
          .input-field {
            display: block;
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #BDC3C7;
            background: var(--background-color);
            color: var(--text-color);
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
      </form>
    </div>
  );
}
