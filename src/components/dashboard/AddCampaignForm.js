import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { uploadVideo, uploadFile } from "../../services/fileUploadService";

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
    // New optional fields from gemini.md
    image: yup.mixed().notRequired(),
    gallery: yup.mixed().notRequired(),
    category: yup.string().notRequired(),
    tags: yup.string().notRequired(),
    region: yup.string().notRequired(),
    beneficiaries: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? undefined : value
      )
      .typeError("الرجاء إدخال رقم صحيح")
      .min(0, "يجب أن يكون العدد أكبر أو يساوي صفر")
      .notRequired(),
    status: yup.string().notRequired(),
    isFeatured: yup.boolean().notRequired(),
    donationType: yup.string().notRequired(),
    currency: yup.string().notRequired(),
    videoType: yup.string().oneOf(["url", "upload"]).notRequired(),
    video: yup.string().when("videoType", {
      is: "url",
      then: (schema) => schema.url("رابط فيديو غير صالح").notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
    videoFile: yup.mixed().when("videoType", {
      is: "upload",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
    documents: yup.mixed().notRequired(),
    contactInfo: yup.string().notRequired(),
    progressUpdates: yup.string().notRequired(),
  })
  .required();

export default function AddCampaignForm({
  onCancel,
  onSubmit: onSubmitProp,
  initialData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user, getAdminLevel, canAccessLevel } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: initialData || { currency: "" },
  });
  const [videoInputType, setVideoInputType] = useState("url");

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading(
      initialData ? "جاري تحديث الحملة..." : "جاري إضافة الحملة..."
    );
    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }
      // Check if user has required admin level (level 2 or higher)
      const userAdminLevel = getAdminLevel();
      if (!canAccessLevel(2)) {
        throw new Error(
          `لا تملك الصلاحيات المطلوبة. المستوى المطلوب: 2، مستواك الحالي: ${userAdminLevel}`
        );
      }
      if (onSubmitProp) {
        // --- Video ---
        let videoUrl = initialData?.video || null;
        if (data.videoType === "url") {
          videoUrl = data.video || initialData?.video || null;
        } else if (
          data.videoFile &&
          data.videoFile[0] &&
          data.videoFile[0].name
        ) {
          videoUrl = await uploadVideo(data.videoFile[0], setUploadProgress);
        }

        // --- Image ---
        let imageUrl = initialData?.image || null;
        if (data.image && data.image[0] && data.image[0].name) {
          imageUrl = await uploadFile(
            data.image[0],
            `campaigns/${data.name}/images/${data.image[0].name}`
          );
        }

        // --- Gallery ---
        let galleryUrls = initialData?.gallery || [];
        if (data.gallery && data.gallery.length > 0) {
          const newFiles = Array.from(data.gallery).filter(
            (file) => file && file.name
          );
          if (newFiles.length > 0) {
            galleryUrls = await Promise.all(
              newFiles.map((file) =>
                uploadFile(file, `campaigns/${data.name}/gallery/${file.name}`)
              )
            );
          }
        }

        // --- Documents ---
        let documentUrls = initialData?.documents || [];
        if (data.documents && data.documents.length > 0) {
          const newFiles = Array.from(data.documents).filter(
            (file) => file && file.name
          );
          if (newFiles.length > 0) {
            documentUrls = await Promise.all(
              newFiles.map((file) =>
                uploadFile(
                  file,
                  `campaigns/${data.name}/documents/${file.name}`
                )
              )
            );
          }
        }

        // Remove File/FileList fields from data
        const cleanedData = { ...data };
        delete cleanedData.image;
        delete cleanedData.gallery;
        delete cleanedData.documents;
        delete cleanedData.videoFile;

        await onSubmitProp({
          ...cleanedData,
          video: videoUrl || null,
          image: imageUrl,
          gallery: galleryUrls,
          documents: documentUrls,
        });
        reset();
        if (onCancel) onCancel();
        toast.success(
          initialData ? "تم تحديث الحملة بنجاح!" : "تمت إضافة الحملة بنجاح!",
          { id: toastId }
        );
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
    <div
      className="flex justify-center items-center min-h-[60vh] bg-[var(--background-color)]"
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
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
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              اسم الحملة
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="input-field"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>
          {/* Goal Amount */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              المبلغ المستهدف
            </label>
            <input
              id="goal"
              type="number"
              step="0.01"
              {...register("goal")}
              className="input-field"
            />
            {errors.goal && (
              <p className="error-message">{errors.goal.message}</p>
            )}
          </div>
        </div>
        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            الوصف
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            className="input-field"
          />
          {errors.description && (
            <p className="error-message">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              تاريخ البدء
            </label>
            <input
              id="startDate"
              type="date"
              {...register("startDate")}
              className="input-field"
            />
            {errors.startDate && (
              <p className="error-message">{errors.startDate.message}</p>
            )}
          </div>
          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              تاريخ الانتهاء
            </label>
            <input
              id="endDate"
              type="date"
              {...register("endDate")}
              className="input-field"
            />
            {errors.endDate && (
              <p className="error-message">{errors.endDate.message}</p>
            )}
          </div>
        </div>
        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="raised"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              المبلغ المجموع (اختياري)
            </label>
            <input
              id="raised"
              type="number"
              step="0.01"
              {...register("raised")}
              className="input-field"
            />
            {errors.raised && (
              <p className="error-message">{errors.raised.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              المبلغ الحالي (اختياري)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
              className="input-field"
            />
            {errors.amount && (
              <p className="error-message">{errors.amount.message}</p>
            )}
          </div>
        </div>
        {/* --- New Fields from gemini.md --- */}
        <div className="pt-4 border-t mt-4">
          <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">
            حقول إضافية للحملة (اختياري)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                صورة الحملة
              </label>
              <input
                id="image"
                type="file"
                {...register("image")}
                className="input-field"
              />
              {errors.image && (
                <p className="error-message">{errors.image.message}</p>
              )}
            </div>
            {/* Gallery */}
            <div>
              <label
                htmlFor="gallery"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                معرض صور الحملة (يمكنك اختيار أكثر من صورة)
              </label>
              <input
                id="gallery"
                type="file"
                multiple
                accept="image/*"
                {...register("gallery")}
                className="input-field"
              />
              {errors.gallery && (
                <p className="error-message">{errors.gallery.message}</p>
              )}
            </div>
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                فئة الحملة
              </label>
              <select
                id="category"
                {...register("category")}
                className="input-field"
              >
                <option value="">اختر الفئة</option>
                <option value="sadaqah">صدقة</option>
                <option value="zakat">زكاة</option>
                <option value="orphans">الأيتام</option>
                <option value="other">أخرى</option>
              </select>
              {errors.category && (
                <p className="error-message">{errors.category.message}</p>
              )}
            </div>
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                الوسوم (مفصولة بفاصلة)
              </label>
              <input
                id="tags"
                type="text"
                {...register("tags")}
                className="input-field"
                placeholder="مثال: داخل السودان , صدقة جارية"
              />
              {errors.tags && (
                <p className="error-message">{errors.tags.message}</p>
              )}
            </div>
            {/* Region */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                المنطقة الجغرافية
              </label>
              <input
                id="region"
                type="text"
                {...register("region")}
                className="input-field"
                placeholder="مثال: منطقة مكة"
              />
              {errors.region && (
                <p className="error-message">{errors.region.message}</p>
              )}
            </div>
            {/* Beneficiaries */}
            <div>
              <label
                htmlFor="beneficiaries"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                عدد المستفيدين
              </label>
              <input
                id="beneficiaries"
                type="number"
                {...register("beneficiaries")}
                className="input-field"
              />
              {errors.beneficiaries && (
                <p className="error-message">{errors.beneficiaries.message}</p>
              )}
            </div>
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                حالة الحملة
              </label>
              <select
                id="status"
                {...register("status")}
                className="input-field"
              >
                <option value="">اختر الحالة</option>
                <option value="active">نشطة</option>
                <option value="completed">مكتملة</option>
                <option value="upcoming">قادمة</option>
                <option value="archived">مؤرشفة</option>
              </select>
              {errors.status && (
                <p className="error-message">{errors.status.message}</p>
              )}
            </div>
            {/* isFeatured */}
            <div>
              <label
                htmlFor="isFeatured"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                تمييز الحملة
              </label>
              <input
                id="isFeatured"
                type="checkbox"
                {...register("isFeatured")}
                className="mr-2"
              />
              <span className="text-gray-600 dark:text-gray-300">
                إظهار الحملة في الصفحة الرئيسية
              </span>
              {errors.isFeatured && (
                <p className="error-message">{errors.isFeatured.message}</p>
              )}
            </div>
            {/* Donation Type */}
            <div>
              <label
                htmlFor="donationType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                نوع التبرع
              </label>
              <select
                id="donationType"
                {...register("donationType")}
                className="input-field"
              >
                <option value="">اختر النوع</option>
                <option value="one-time">مرة واحدة</option>
                <option value="recurring">متكرر</option>
              </select>
              {errors.donationType && (
                <p className="error-message">{errors.donationType.message}</p>
              )}
            </div>
            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                العملة
              </label>
              <input
                id="currency"
                type="text"
                {...register("currency")}
                className="input-field"
                placeholder="مثال: SAR, USD"
              />
              {errors.currency && (
                <p className="error-message">{errors.currency.message}</p>
              )}
            </div>
            {/* Video */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                فيديو الحملة
              </label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="url"
                    checked={videoInputType === "url"}
                    onChange={() => setVideoInputType("url")}
                    className="mr-1"
                  />
                  رابط فيديو
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="upload"
                    checked={videoInputType === "upload"}
                    onChange={() => setVideoInputType("upload")}
                    className="mr-1"
                  />
                  رفع فيديو من الجهاز
                </label>
              </div>
              {videoInputType === "url" ? (
                <input
                  id="video"
                  type="url"
                  {...register("video")}
                  className="input-field"
                  placeholder="رابط فيديو (اختياري)"
                />
              ) : (
                <input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  {...register("videoFile")}
                  className="input-field"
                />
              )}
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {errors.video && (
                <p className="error-message">{errors.video.message}</p>
              )}
              {errors.videoFile && (
                <p className="error-message">{errors.videoFile.message}</p>
              )}
            </div>
            {/* Documents */}
            <div>
              <label
                htmlFor="documents"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                مستندات داعمة (اختياري)
              </label>
              <input
                id="documents"
                type="file"
                multiple
                {...register("documents")}
                className="input-field"
              />
              {errors.documents && (
                <p className="error-message">{errors.documents.message}</p>
              )}
            </div>
            {/* Contact Info */}
            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                معلومات التواصل الخاصة بالحملة
              </label>
              <input
                id="contactInfo"
                type="text"
                {...register("contactInfo")}
                className="input-field"
                placeholder="بريد إلكتروني أو رقم هاتف"
              />
              {errors.contactInfo && (
                <p className="error-message">{errors.contactInfo.message}</p>
              )}
            </div>
            {/* Progress Updates */}
            <div>
              <label
                htmlFor="progressUpdates"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                تحديثات الحملة (اختياري)
              </label>
              <textarea
                id="progressUpdates"
                {...register("progressUpdates")}
                rows={2}
                className="input-field"
                placeholder="أدخل تحديثات أو ملاحظات عن تقدم الحملة"
              />
              {errors.progressUpdates && (
                <p className="error-message">
                  {errors.progressUpdates.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#3cc400] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#216c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-colors disabled:bg-neutral-medium disabled:cursor-not-allowed"
          >
            {isLoading
              ? initialData
                ? "جاري التحديث..."
                : "جاري الإضافة..."
              : initialData
              ? "تحديث الحملة"
              : "إنشاء الحملة"}
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
