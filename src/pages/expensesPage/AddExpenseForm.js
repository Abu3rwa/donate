import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAllCampaigns } from "../../services/compaignService";
import { getDonationsForCampaign } from "../../services/donationsService";
import { uploadFile } from "../../services/fileUploadService";
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

const CATEGORY_LABELS = {
  operations: "تشغيلية",
  purchase: "شراء",
  salary: "راتب",
  donation: "تبرع",
  other: "أخرى",
};

const STATUS_LABELS = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

const AddExpenseForm = ({ initialData, onSubmit, onCancel, user }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(
    initialData?.campaignId || ""
  );
  const [totalDonations, setTotalDonations] = useState(0);
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    amount: initialData?.amount || "",
    category: initialData?.category || "operations",
    status: initialData?.status || "pending",
    submittedBy: user?.uid || user?.displayName,
    bills: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if user can change status
  const canEditStatus =
    user?.role === "super_admin" || user?.role === "reviewer";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      if (selectedCampaign) {
        try {
          const donations = await getDonationsForCampaign(selectedCampaign);
          const total = donations.reduce((acc, curr) => acc + curr.amount, 0);
          setTotalDonations(total);
        } catch (error) {
          console.error("Error fetching donations:", error);
          setTotalDonations(0);
        }
      }
    };
    fetchDonations();
  }, [selectedCampaign]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bills") {
      setFormData((prev) => ({ ...prev, bills: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };

  const validate = () => {
    const newErrors = {};

    // Campaign validation
    if (!selectedCampaign) {
      newErrors.campaign = "يرجى اختيار الحملة.";
    } else {
      const selectedCampaignData =
        campaigns.find((c) => c.id === selectedCampaign) ||
        (selectedCampaign === "general"
          ? { name: "عام", budget: Infinity }
          : null);

      if (!selectedCampaignData) {
        newErrors.campaign = "الحملة المختارة غير موجودة.";
      } else if (selectedCampaignData.status === "inactive") {
        newErrors.campaign = "الحملة غير نشطة.";
      }
    }

    // Description validation
    if (!formData.description.trim())
      newErrors.description = "يرجى إدخال وصف المصروف.";

    // Amount validation
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    )
      newErrors.amount = "يرجى إدخال مبلغ صحيح.";

    // Check for reasonable amount (not too small or too large)
    const amount = Number(formData.amount);
    if (amount > 0 && amount < 1) {
      newErrors.amount = "المبلغ صغير جداً.";
    } else if (amount > 1000000) {
      newErrors.amount = "المبلغ كبير جداً.";
    }

    // Check against campaign budget
    if (formData.amount > totalDonations)
      newErrors.amount = "المبلغ أكبر من إجمالي تبرعات الحملة.";

    // Check against campaign budget limit if exists
    if (selectedCampaign && selectedCampaign !== "general") {
      const selectedCampaignData = campaigns.find(
        (c) => c.id === selectedCampaign
      );
      if (
        selectedCampaignData &&
        selectedCampaignData.budget &&
        amount > selectedCampaignData.budget
      ) {
        newErrors.amount = `المبلغ يتجاوز ميزانية الحملة (${selectedCampaignData.budget} ج.س).`;
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      let billsUrl = null;
      // Upload file if selected
      if (formData.bills) {
        billsUrl = await uploadFile(formData.bills, "expenses/bills");
      }

      // Get current user for audit trail
      const auth = getAuth();
      const currentUser = auth.currentUser;

      // Generate receipt number
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
      const receiptNumber = `EXP${currentYear}${currentMonth}${String(
        Math.floor(Math.random() * 10000)
      ).padStart(4, "0")}`;

      // Set date automatically to today (ISO string)
      const today = new Date().toISOString().split("T")[0];

      // Prepare expense data with audit trail
      const expenseData = {
        ...formData,
        campaignId: selectedCampaign,
        date: today,
        billsUrl,
        receiptNumber,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || "unknown",
        createdByEmail: currentUser?.email || "unknown",
        statusHistory: [
          {
            status: formData.status,
            changedBy: currentUser?.uid || "unknown",
            changedAt: serverTimestamp(),
            reason: "Initial creation",
          },
        ],
      };

      // Submit expense
      await onSubmit(expenseData);

      // Generate and send receipt notification
      await generateAndSendReceipt(expenseData);
    } catch (error) {
      console.error("Error submitting expense:", error);
      setErrors({ submit: "فشل في إضافة المصروف" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate receipt and send notifications
  const generateAndSendReceipt = async (expenseData) => {
    try {
      // Generate receipt HTML
      const receiptHtml = generateExpenseReceipt(expenseData);

      // Send notification to relevant parties
      await sendExpenseNotification(expenseData);

      console.log("Receipt generated and notifications sent");
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  };

  // Generate expense receipt HTML
  const generateExpenseReceipt = (expenseData) => {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; color: #333;">إيصال مصروف</h2>
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <p><strong>رقم الإيصال:</strong> ${expenseData.receiptNumber}</p>
          <p><strong>التاريخ:</strong> ${expenseData.date}</p>
          <p><strong>الوصف:</strong> ${expenseData.description}</p>
          <p><strong>المبلغ:</strong> ${expenseData.amount} ج.س</p>
          <p><strong>التصنيف:</strong> ${
            CATEGORY_LABELS[expenseData.category]
          }</p>
          <p><strong>الحالة:</strong> ${STATUS_LABELS[expenseData.status]}</p>
          <p><strong>المُقدِّم:</strong> ${expenseData.submittedBy}</p>
        </div>
      </div>
    `;
  };

  // Send expense notification
  const sendExpenseNotification = async (expenseData) => {
    try {
      // This would integrate with your notification service
      // For now, just log the notification
      console.log("Expense notification sent:", {
        type: "expense_created",
        expenseId: expenseData.receiptNumber,
        amount: expenseData.amount,
        campaign: expenseData.campaignId,
        submittedBy: expenseData.submittedBy,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="campaign"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          الحملة<span className="text-red-500">*</span>
        </label>
        <select
          id="campaign"
          name="campaign"
          value={selectedCampaign}
          onChange={handleCampaignChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-150 appearance-none ${
            errors.campaign ? "border-red-500" : ""
          }`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
            paddingRight: "2.5em",
          }}
        >
          <option
            value=""
            className="text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800"
          >
            اختر حملة
          </option>
          <option
            value="general"
            className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          >
            عام
          </option>
          {campaigns.map((campaign) => (
            <option
              key={campaign.id}
              value={campaign.id}
              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-700"
            >
              {campaign.name}
            </option>
          ))}
        </select>
        {selectedCampaign && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            إجمالي التبرعات لهذه الحملة: {totalDonations} ج.س
          </p>
        )}
        {errors.campaign && (
          <p className="text-xs text-red-500 mt-1">{errors.campaign}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          الوصف<span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.description ? "border-red-500" : ""
          }`}
        ></textarea>
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          المبلغ<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.amount ? "border-red-500" : ""
          }`}
        />
        {errors.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          التصنيف
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          الحالة
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          disabled={!canEditStatus}
        >
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="bills"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          المرفقات (فواتير/إيصالات)
        </label>
        <input
          type="file"
          id="bills"
          name="bills"
          accept="image/*,application/pdf"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          المُقدِّم
        </label>
        <input
          type="text"
          value={user?.displayName || "غير معروف"}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm sm:text-sm dark:border-gray-600 dark:text-white cursor-not-allowed"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isSubmitting
            ? "جاري الإضافة..."
            : initialData
            ? "حفظ التعديلات"
            : "إضافة مصروف"}
        </button>
      </div>
    </form>
  );
};

AddExpenseForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default AddExpenseForm;
