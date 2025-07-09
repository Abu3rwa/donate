import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const billSchema = yup.object({
  expenseId: yup.string().required("يرجى اختيار المصروف المرتبط"),
  file: yup.mixed().required("يرجى رفع ملف الفاتورة أو الإيصال"),
  description: yup.string(),
});

export default function AddBillForm({ expenses, onCancel, onSubmit, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(billSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    const file = data.file && data.file.length ? data.file[0] : null;
    await onSubmit({ ...data, file });
    reset();
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6" dir="rtl" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">المصروف المرتبط</label>
        <select {...register("expenseId")} className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option value="">اختر المصروف</option>
          {expenses.map((exp) => (
            <option key={exp.id} value={exp.id}>{exp.description} ({exp.amount} ج.س)</option>
          ))}
        </select>
        {errors.expenseId && <p className="error-message">{errors.expenseId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">ملف الفاتورة/الإيصال</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          {...register("file")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {errors.file && <p className="error-message">{errors.file.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">الوصف (اختياري)</label>
        <textarea
          rows={2}
          {...register("description")}
          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        ></textarea>
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {initialData ? "تعديل الفاتورة" : "رفع فاتورة"}
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