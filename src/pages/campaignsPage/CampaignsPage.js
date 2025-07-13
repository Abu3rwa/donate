import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useOrganizationInfo } from "../../contexts/OrganizationInfoContext";
import AddCampaignForm from "../../components/dashboard/AddCampaignForm";
import {
  getAllCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} from "../../services/compaignService";
import { exportToImage } from "./export/exportToImage";
import { generateExportHtml } from "./export/generateExportHtml";
import toArabicNumbers from "../../helpers/toArabicNumbers";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "غير محدد";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    paused:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    planning: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  const statusText = {
    active: "نشطة",
    completed: "مكتملة",
    paused: "متوقفة",
    planning: "قيد التخطيط",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
        statusStyles[status] || statusStyles.planning
      }`}
    >
      {statusText[status] || status}
    </span>
  );
};

const ProgressBar = ({ raised, goal }) => {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const color = percentage >= 100 ? "bg-emerald-500" : "bg-blue-500";
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Modal = ({ children, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CampaignsPage = () => {
  const { user, hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { orgInfo } = useOrganizationInfo();
  const exportRef = useRef(null);

  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    searchTerm: "",
    dateRange: "all",
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCampaigns({ dateRange: filters.dateRange });
      setCampaigns(data);
    } catch (err) {
      showError(err.message || "فشل في تحميل الحملات.");
    } finally {
      setLoading(false);
    }
  }, [filters.dateRange, showError]);

  useEffect(() => {
    fetchCampaigns();
  }, [filters.dateRange]);

  useEffect(() => {
    const filtered = campaigns
      .filter((c) => filters.status === "all" || c.status === filters.status)
      .filter((c) =>
        c.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );

    if (filtered.length > 0) {
      const totalCampaigns = filtered.length;
      const activeCampaigns = filtered.filter(
        (c) => c.status === "active"
      ).length;
      const completedCampaigns = filtered.filter(
        (c) => c.status === "completed"
      ).length;
      const totalGoal = filtered.reduce((sum, c) => sum + (c.goal || 0), 0);
      const totalRaised = filtered.reduce((sum, c) => sum + (c.raised || 0), 0);
      setStats({
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalGoal,
        totalRaised,
      });
    } else {
      setStats(null);
    }
  }, [campaigns, filters]);

  const handleAddCampaign = async (data) => {
    try {
      await addCampaign(data);
      showSuccess("تمت إضافة الحملة بنجاح!");
      setIsModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      showError(err.message || "فشل في إضافة الحملة.");
    }
  };

  const handleEditCampaign = async (id, data) => {
    try {
      await updateCampaign(id, data);
      showSuccess("تم تحديث الحملة بنجاح!");
      setIsModalOpen(false);
      setEditCampaign(null);
      fetchCampaigns();
    } catch (err) {
      showError(err.message || "فشل في تحديث الحملة.");
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!hasPermission("manage_campaigns")) {
      showError("ليس لديك الصلاحية لحذف الحملات.");
      return;
    }
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الحملة؟")) return;
    try {
      await deleteCampaign(id);
      showSuccess("تم حذف الحملة بنجاح!");
      fetchCampaigns();
    } catch (err) {
      showError(err.message || "فشل في حذف الحملة.");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    if (!user) {
      showError("يرجى الانتظار حتى يتم تحميل معلومات المسؤول.");
      return;
    }
    try {
      setExporting(true);
      const html = await generateExportHtml({
        orgInfo,
        campaigns: filteredCampaigns,
        user,
      });
      await exportToImage({
        html,
        fileName: `campaigns_report_${
          new Date().toISOString().split("T")[0]
        }.png`,
      });
      showSuccess("تم تصدير تقرير الحملات بنجاح!");
    } catch (err) {
      showError("حدث خطأ أثناء تصدير تقرير الحملات.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(
      (c) =>
        (filters.status === "all" || c.status === filters.status) &&
        c.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }, [campaigns, filters]);

  if (loading && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background-color)] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--background-color)] p-2 sm:p-4"
      dir="rtl"
      style={{
        fontFamily:
          "'Tajawal', 'Cairo', 'Alexandria', 'Amiri', 'DM Serif Text', Tahoma, Arial, sans-serif",
      }}
    >
      <div className="max-w-full mx-auto px-2" ref={exportRef}>
        {/* Header */}
        <div className="flex flex-col justify-center items-center pb-6 gap-4 mb-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-2">
              إدارة الحملات
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-color-secondary)]">
              عرض وتعديل وإنشاء الحملات الخيرية
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            {hasPermission("manage_campaigns") && (
              <button
                onClick={() => {
                  setEditCampaign(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-[#3cc400] text-white px-3 py-2 rounded-lg hover:bg-[#216c00] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">إنشاء حملة جديدة</span>
                <span className="sm:hidden">إنشاء</span>
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full sm:w-auto bg-[#198754] hover:bg-[#146c43] text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">تصدير التقارير</span>
              <span className="sm:hidden">تصدير</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {/* Cards here */}
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                إجمالي الحملات
              </p>
              <p className="text-lg font-bold text-[var(--text-color)]">
                {toArabicNumbers(stats.totalCampaigns)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                النشطة
              </p>
              <p className="text-lg font-bold text-[var(--text-color)]">
                {toArabicNumbers(stats.activeCampaigns)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                المكتملة
              </p>
              <p className="text-lg font-bold text-[var(--text-color)]">
                {toArabicNumbers(stats.completedCampaigns)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                إجمالي الأهداف
              </p>
              <p className="text-lg font-bold text-[var(--text-color)]">
                {toArabicNumbers(formatCurrency(stats.totalGoal))}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                إجمالي المحصل
              </p>
              <p className="text-lg font-bold text-[var(--text-color)]">
                {toArabicNumbers(formatCurrency(stats.totalRaised))}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
          style={{ boxShadow: "0 2px 8px rgba(60, 196, 0, 0.07)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث بالاسم..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                الحالة
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full text-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشطة</option>
                <option value="completed">مكتملة</option>
                <option value="paused">متوقفة</option>
                <option value="planning">قيد التخطيط</option>
              </select>
            </div>
          </div>
          {/* Date Range Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
              الفترة الزمنية
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "الكل" },
                { value: "today", label: "اليوم" },
                { value: "week", label: "هذا الأسبوع" },
                { value: "month", label: "هذا الشهر" },
                { value: "year", label: "هذا العام" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleFilterChange("dateRange", range.value)}
                  className={`px-2 text-center sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    filters.dateRange === range.value
                      ? "bg-[#3cc400] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-[var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    الحملة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    التقدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    تاريخ الانتهاء
                  </th>
                  {hasPermission("manage_campaigns") && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                      الإجراءات
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--text-color)]">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-grow">
                          <ProgressBar
                            raised={campaign.raised || 0}
                            goal={campaign.goal || 0}
                          />
                        </div>
                        <div className="text-sm text-[var(--text-color-secondary)]">
                          {toArabicNumbers(
                            formatCurrency(campaign.raised || 0)
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color-secondary)]">
                      {toArabicNumbers(formatDate(campaign.endDate))}
                    </td>
                    {hasPermission("manage_campaigns") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditCampaign(campaign);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="تعديل"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-red-600 hover:text-red-800"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-medium text-[var(--text-color)] line-clamp-2">
                    {campaign.name}
                  </h3>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-color-secondary)]">
                      المحصل
                    </span>
                    <span className="font-bold text-[var(--text-color)]">
                      {toArabicNumbers(formatCurrency(campaign.raised || 0))}
                    </span>
                  </div>
                  <ProgressBar
                    raised={campaign.raised || 0}
                    goal={campaign.goal || 0}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[var(--text-color-secondary)]">
                      الهدف:{" "}
                      {toArabicNumbers(formatCurrency(campaign.goal || 0))}
                    </span>
                    <span className="text-[var(--text-color-secondary)]">
                      ينتهي في: {toArabicNumbers(formatDate(campaign.endDate))}
                    </span>
                  </div>
                </div>
                {hasPermission("manage_campaigns") && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditCampaign(campaign);
                        setIsModalOpen(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCampaigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-[var(--text-color)]">
                لا توجد حملات
              </h3>
              <p className="mt-1 text-sm text-[var(--text-color-secondary)]">
                {filters.searchTerm || filters.status !== "all"
                  ? "لا توجد حملات تطابق معايير البحث."
                  : "لم يتم إنشاء أي حملات بعد."}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen || !!editCampaign}
          onClose={() => {
            setIsModalOpen(false);
            setEditCampaign(null);
          }}
        >
          <AddCampaignForm
            onCancel={() => {
              setIsModalOpen(false);
              setEditCampaign(null);
            }}
            onSubmit={
              editCampaign
                ? (data) => handleEditCampaign(editCampaign.id, data)
                : handleAddCampaign
            }
            initialData={editCampaign}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CampaignsPage;
