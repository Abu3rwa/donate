import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const categories = [
  { value: "operations", label: "تشغيلية" },
  { value: "purchase", label: "شراء" },
  { value: "salary", label: "راتب" },
  { value: "donation", label: "تبرع" },
  { value: "other", label: "أخرى" },
];

const expenseSchema = yup.object({
  amount: yup
    .number()
    .typeError("الرجاء إدخال مبلغ صحيح")
    .positive("يجب أن يكون المبلغ أكبر من صفر")
    .required("المبلغ مطلوب"),
  category: yup.string().required("التصنيف مطلوب"),
  description: yup.string().required("الوصف مطلوب"),
  date: yup.string().required("التاريخ مطلوب"),
  files: yup.mixed(),
  submittedBy: yup.string().required("اسم المقدم مطلوب"),
});

export default function AddExpenseForm({ onCancel, onSubmit, initialData, user }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(expenseSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    // Convert file input to array of files
    const files = data.files && data.files.length ? Array.from(data.files) : [];
    await onSubmit({
      ...data,
      files,
      submittedBy: user?.displayName || user?.email,
      submittedById: user?.uid,
      submittedByRole: user?.role,
      submittedByAdminType: user?.adminType,
    });
    reset();
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6" dir="rtl" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المبلغ</label>
        <input
          type="number"
          step="0.01"
          {...register("amount")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {errors.amount && <p className="error-message">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">التصنيف</label>
        <select {...register("category")} className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option value="">اختر التصنيف</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        {errors.category && <p className="error-message">{errors.category.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">الوصف</label>
        <textarea
          rows={3}
          {...register("description")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        ></textarea>
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">التاريخ</label>
        <input
          type="date"
          {...register("date")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {errors.date && <p className="error-message">{errors.date.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المرفقات (فواتير/إيصالات)</label>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          {...register("files")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {errors.files && <p className="error-message">{errors.files.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">اسم المقدم</label>
        <input
          type="text"
          value={user?.displayName || user?.email || "-"}
          className="input-field bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {initialData ? "تعديل المصروف" : "إضافة مصروف"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
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
  );
} 