import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import AddDonationForm from "../../components/dashboard/AddDonationForm";
import { Download, FileText, MoreVertical, Trash2 } from "lucide-react";
import {
  fetchDonations,
  getDonationStats,
  searchDonations,
  deleteDonation,
  addDonation,
} from "../../services/donationsService";
import { getAllCampaigns } from "../../services/compaignService";

import { getOrgInfo } from "../../services/orgInfoService";

import { exportToImage } from "./export/exportToImage";
import { generateExportHtml } from "./export/generateExportHtml";
import { generateReceiptExportHtml } from "./ReceiptGenerator";
import generateDonationDetailsHtml from "./generateDonationDetailsHtml";

const DonationsPage = () => {
  const { user, hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [, setSearchParams] = useSearchParams();
  const exportRef = useRef(null);
  const [orgInfo, setOrgInfo] = useState({});
  useEffect(() => {
    const fetchOrg = async () => {
      const info = await getOrgInfo();
      setOrgInfo(info || {});
    };
    fetchOrg();
  }, []);
  // State management
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Bulk selection state
  const [selectedDonations, setSelectedDonations] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: "all",
    campaign: "all",
    dateRange: "all",
    searchTerm: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.campaign !== "all") params.set("campaign", filters.campaign);
    if (filters.dateRange !== "all") params.set("dateRange", filters.dateRange);
    if (filters.searchTerm) params.set("search", filters.searchTerm);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Load data when filters change
  useEffect(() => {
    loadDonations();
    loadStats();
  }, [filters.status, filters.campaign, filters.dateRange]);

  const loadDonations = useCallback(
    async (isLoadMore = false) => {
      try {
        if (!isLoadMore) {
          setLoading(true);
          setCurrentPage(1);
          setLastDoc(null);
        }

        const result = await fetchDonations({
          ...filters,
          limit: PAGE_SIZE,
          startAfter: isLoadMore ? lastDoc : null,
        });

        if (isLoadMore) {
          setDonations((prev) => [...prev, ...result.donations]);
        } else {
          setDonations(result.donations);
        }

        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } catch (error) {
        showError("فشل في تحميل التبرعات");
      } finally {
        setLoading(false);
      }
    },
    [
      filters,
      PAGE_SIZE,
      lastDoc,
      fetchDonations,
      setLoading,
      setCurrentPage,
      setLastDoc,
      setDonations,
      setHasMore,
      showError,
    ]
  );

  const loadStats = useCallback(async () => {
    try {
      const statsData = await getDonationStats({
        dateRange: filters.dateRange,
        campaign: filters.campaign,
      });
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [filters.dateRange, filters.campaign, getDonationStats, setStats]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [campaignsData] = await Promise.all([
        getAllCampaigns(),
        loadDonations(),
        loadStats(),
      ]);
      setCampaigns(campaignsData);
    } catch (error) {
      showError("فشل في تحميل البيانات الأولية");
    } finally {
      setLoading(false);
    }
  }, [getAllCampaigns, loadDonations, loadStats, showError]);

  // Load initial data - moved after function definition
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSearch = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        setFilters((prev) => ({ ...prev, searchTerm: "" }));
        return;
      }

      try {
        setSearchLoading(true);
        const results = await searchDonations(searchTerm, {
          status: filters.status,
          campaign: filters.campaign,
        });
        setDonations(results);
        setHasMore(false);
      } catch (error) {
        showError("فشل في البحث");
      } finally {
        setSearchLoading(false);
      }
    },
    [filters.status, filters.campaign, showError]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadDonations(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAddDonation = async (donationData) => {
    try {
      const newDonation = await addDonation(donationData);
      setShowAddForm(false);

      // Add the new donation to the beginning of the list
      setDonations((prev) => [newDonation, ...prev]);

      // Reload stats to update totals
      loadStats();

      showSuccess("تمت إضافة التبرع بنجاح!");
    } catch (error) {
      showError("فشل في إضافة التبرع");
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!hasPermission("manage_donations")) {
      showError("ليس لديك صلاحية لحذف التبرعات");
      return;
    }

    if (window.confirm("هل أنت متأكد من حذف هذا التبرع؟")) {
      try {
        await deleteDonation(donationId);
        setDonations((prev) => prev.filter((d) => d.id !== donationId));
        loadStats();
        showSuccess("تم حذف التبرع بنجاح!");
      } catch (error) {
        showError("فشل في حذف التبرع");
      }
    }
  };

  // Bulk selection handlers
  const handleSelectDonation = (donationId) => {
    setSelectedDonations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(donationId)) {
        newSet.delete(donationId);
      } else {
        newSet.add(donationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDonations(new Set());
      setSelectAll(false);
    } else {
      setSelectedDonations(new Set(donations.map((d) => d.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = async () => {
    if (!hasPermission("manage_donations")) {
      showError("ليس لديك صلاحية لحذف التبرعات");
      return;
    }

    if (selectedDonations.size === 0) {
      showError("يرجى اختيار تبرعات للحذف");
      return;
    }

    const count = selectedDonations.size;
    if (window.confirm(`هل أنت متأكد من حذف ${count} تبرع محدد؟`)) {
      try {
        const deletePromises = Array.from(selectedDonations).map((donationId) =>
          deleteDonation(donationId)
        );

        await Promise.all(deletePromises);

        // Remove deleted donations from local state
        setDonations((prev) =>
          prev.filter((d) => !selectedDonations.has(d.id))
        );

        // Clear selection
        setSelectedDonations(new Set());
        setSelectAll(false);

        // Reload stats
        loadStats();

        showSuccess(`تم حذف ${count} تبرع بنجاح!`);
      } catch (error) {
        showError("فشل في حذف بعض التبرعات");
      }
    }
  };

  const handleExportDonations = async () => {
    try {
      setExporting(true);

      const html = await generateExportHtml({
        orgInfo,
        stats,
        donations,
        campaigns,
        getStatusText,
        user,
      });
      await exportToImage({
        html,
        fileName: `donations_report_${
          new Date().toISOString().split("T")[0]
        }.png`,
      });
      showSuccess("تم تصدير التبرعات كصورة بنجاح!");
    } catch (error) {
      showError("حدث خطأ أثناء تصدير التبرعات");
      console.log(error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportDonationDetailsImage = async (donation) => {
    const html = await generateDonationDetailsHtml({
      donation,
      orgInfo,
      campaigns,
      getStatusText,
      user,
    });
    await exportToImage({
      html,
      fileName: `donation_details_${donation.id}_${
        new Date().toISOString().split("T")[0]
      }.png`,
    });
  };

  // Update select all when donations change
  useEffect(() => {
    if (donations.length > 0 && selectedDonations.size === donations.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedDonations, donations]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "failed":
        return "فشل";
      default:
        return status;
    }
  };

  const handleDownloadReceiptImage = async (donation) => {
    if (donation.receiptUrl) {
      try {
        // Create a link and trigger the download
        const link = document.createElement("a");
        link.href = donation.receiptUrl;
        link.setAttribute(
          "download",
          `receipt_${donation.id}_${new Date().toISOString().split("T")[0]}.png`
        );
        // Append to html link object to cross origin
        document.body.appendChild(link);
        link.click();
        link.remove();
        showSuccess("تم بدء تحميل الإيصال.");
      } catch (error) {
        showError("فشل تحميل الإيصال. قد يكون الرابط غير صالح.");
        console.error("Error downloading receipt from URL:", error);
      }
    } else {
      // Fallback to generating the image if no URL is present
      showError("لا يوجد إيصال مرفق، سيتم إنشاء إيصال الآن.");
      const html = await generateReceiptExportHtml({
        donation,
        campaigns,
        getStatusText,
        orgInfo,
      });
      await exportToImage({
        html,
        fileName: `receipt_${donation.id}_${
          new Date().toISOString().split("T")[0]
        }.png`,
      });
    }
  };
  // Remove handleDownloadReceiptHtml and the 'تحميل الإيصال (HTML)' button from the actions dropdown and mobile card actions.
  // Only keep handleDownloadReceiptImage and its button.

  if (loading && donations.length === 0) {
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
      className="min-h-screen bg-[var(--background-color)] p-1 xs:p-2 sm:p-4"
      dir="rtl"
      style={{
        fontFamily:
          "'Tajawal', 'Cairo', 'Alexandria', 'Amiri', 'DM Serif Text', Tahoma, Arial, sans-serif",
      }}
    >
      <div className="max-w-full mx-auto px-1 xs:px-2" ref={exportRef}>
        {/* Header */}
        <div className="flex flex-col justify-center items-center pb-6 gap-4 mb-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-2">
              إدارة التبرعات
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-color-secondary)]">
              عرض وإدارة جميع التبرعات في النظام
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 w-full max-w-sm xs:max-w-md">
            {hasPermission("manage_donations") && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full xs:w-auto bg-[#3cc400] text-white px-2 xs:px-3 py-2 rounded-lg hover:bg-[#216c00] transition-colors flex items-center justify-center gap-1 xs:gap-2 text-xs xs:text-sm"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="hidden xs:inline">إضافة تبرع جديد</span>
                <span className="xs:hidden">إضافة</span>
              </button>
            )}
            <button
              onClick={handleExportDonations}
              disabled={exporting}
              className="w-full xs:w-auto bg-[#198754] hover:bg-[#146c43] text-white px-2 xs:px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 xs:gap-2 text-xs xs:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="hidden xs:inline">تصدير التقارير</span>
              <span className="xs:hidden">تصدير</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                    إجمالي التبرعات
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[var(--text-color)] break-words">
                    {new Intl.NumberFormat("en-US").format(stats.totalAmount)}{" "}
                    ج.س
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-2 xs:p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                    عدد المتبرعين
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[var(--text-color)] break-words">
                    {stats.uniqueDonors}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-2 xs:p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400"
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
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                    عدد التبرعات
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[var(--text-color)] break-words">
                    {stats.totalDonations}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-2 xs:p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-color-secondary)] mb-1">
                    متوسط التبرع
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[var(--text-color)] break-words">
                    {new Intl.NumberFormat("en-US").format(
                      Math.round(stats.averageAmount)
                    )}{" "}
                    ج.س
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div
          className="bg-white dark:bg-gray-800 p-3 xs:p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
          style={{ boxShadow: "0 2px 8px rgba(60, 196, 0, 0.07)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث بالاسم أو رقم الهاتف..."
                  value={filters.searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({ ...prev, searchTerm: value }));
                    if (value.trim()) {
                      const timeoutId = setTimeout(
                        () => handleSearch(value),
                        500
                      );
                      return () => clearTimeout(timeoutId);
                    } else {
                      loadDonations();
                    }
                  }}
                  className="w-full px-2 xs:px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-xs xs:text-sm"
                />
                {searchLoading && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3cc400]"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                الحالة
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full text-center px-2 xs:px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-xs xs:text-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="completed">مكتمل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="failed">فشل</option>
              </select>
            </div>

            {/* Campaign Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                الحملة
              </label>
              <select
                value={filters.campaign}
                onChange={(e) => handleFilterChange("campaign", e.target.value)}
                className="w-full text-center px-2 xs:px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-xs xs:text-sm"
              >
                <option value="all">جميع الحملات</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
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
                  className={`px-1 xs:px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
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

        {/* Bulk Actions */}
        {hasPermission("manage_donations") && selectedDonations.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
            <div className="flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  تم اختيار {selectedDonations.size} تبرع
                </span>
              </div>
              <div className="flex items-center gap-1 xs:gap-2 mt-2 xs:mt-0">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  حذف المحدد
                </button>
                <button
                  onClick={() => {
                    setSelectedDonations(new Set());
                    setSelectAll(false);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Donations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {hasPermission("manage_donations") && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#3cc400] bg-gray-100 border-gray-300 rounded focus:ring-[#3cc400] focus:ring-2"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    المتبرع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    الحملة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                    التاريخ
                  </th>
                  {hasPermission("manage_donations") && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-color-secondary)] uppercase tracking-wider">
                      الإجراءات
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {donations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {hasPermission("manage_donations") && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.id)}
                          onChange={() => handleSelectDonation(donation.id)}
                          className="w-4 h-4 text-[#3cc400] bg-gray-100 border-gray-300 rounded focus:ring-[#3cc400] focus:ring-2"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--text-color)]">
                          {donation.isAnonymous
                            ? "فاعل خير"
                            : donation.donorName}
                        </div>
                        <div className="text-sm text-[var(--text-color-secondary)]">
                          {donation.donorPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--text-color)]">
                        {donation.formattedAmount}
                      </div>
                      {donation.recurringDonation && (
                        <div className="text-xs text-[var(--text-color-secondary)]">
                          متكرر
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-color)]">
                        {donation.campaign === "general"
                          ? "     عام تبرع"
                          : campaigns.find((c) => c.id === donation.campaign)
                              ?.name || "غير محدد"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {getStatusText(donation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color-secondary)]">
                      {donation.formattedDate}
                    </td>
                    {hasPermission("manage_donations") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === donation.id ? null : donation.id
                              )
                            }
                            aria-haspopup="true"
                            aria-expanded={openMenuId === donation.id}
                          >
                            <MoreVertical size={20} className="text-gray-500" />
                          </button>
                          {openMenuId === donation.id && (
                            <div
                              className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              onMouseLeave={() => setOpenMenuId(null)}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleDownloadReceiptImage(donation);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Download size={16} className="ml-2" />
                                  تحميل الإيصال
                                </button>
                                <button
                                  onClick={() => {
                                    handleExportDonationDetailsImage(donation);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <FileText size={16} className="ml-2" />
                                  تصدير التفاصيل
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteDonation(donation.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                                >
                                  <Trash2 size={16} className="ml-2" />
                                  حذف
                                </button>
                              </div>
                            </div>
                          )}
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
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="p-2 xs:p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                {hasPermission("manage_donations") && (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedDonations.has(donation.id)}
                      onChange={() => handleSelectDonation(donation.id)}
                      className="w-4 h-4 text-[#3cc400] bg-gray-100 border-gray-300 rounded focus:ring-[#3cc400] focus:ring-2"
                    />
                    <span className="text-xs text-[var(--text-color-secondary)]">
                      تحديد للحذف
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-[var(--text-color)]">
                        {donation.isAnonymous ? "فاعل خير" : donation.donorName}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {getStatusText(donation.status)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-color-secondary)] mb-1">
                      {donation.donorPhone}
                    </p>
                    <p className="text-xs text-[var(--text-color-secondary)]">
                      {donation.campaign === "general"
                        ? "الحملة غير محدد"
                        : campaigns.find((c) => c.id === donation.campaign)
                            ?.name || "غير محدد"}
                    </p>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[var(--text-color)]">
                      {donation.formattedAmount}
                    </div>
                    {donation.recurringDonation && (
                      <div className="text-xs text-[var(--text-color-secondary)] text-center">
                        متكرر
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-[var(--text-color-secondary)]">
                    {donation.formattedDate}
                  </div>
                  {hasPermission("manage_donations") && (
                    <div className="flex items-center justify-end gap-1 xs:gap-2 mt-3 xs:mt-4 pt-2 xs:pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleDownloadReceiptImage(donation)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors px-1 xs:px-2 py-1 rounded"
                      >
                        <Download size={12} className="xs:w-4 xs:h-4" />
                        إيصال
                      </button>
                      <button
                        onClick={() =>
                          handleExportDonationDetailsImage(donation)
                        }
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors px-1 xs:px-2 py-1 rounded"
                      >
                        <FileText size={12} className="xs:w-4 xs:h-4" />
                        تفاصيل
                      </button>
                      <button
                        onClick={() => handleDeleteDonation(donation.id)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors px-1 xs:px-2 py-1 rounded"
                      >
                        <Trash2 size={12} className="xs:w-4 xs:h-4" />
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {donations.length === 0 && !loading && (
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
                لا توجد تبرعات
              </h3>
              <p className="mt-1 text-sm text-[var(--text-color-secondary)]">
                {filters.searchTerm
                  ? "لا توجد نتائج للبحث المحدد"
                  : "لم يتم العثور على أي تبرعات بعد"}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && donations.length > 0 && (
            <div className="px-1 xs:px-2 sm:px-4 py-3 xs:py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري التحميل..." : "تحميل المزيد"}
              </button>
            </div>
          )}
        </div>

        {/* Add Donation Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1 xs:p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xs xs:max-w-sm sm:max-w-2xl max-h-[98vh] xs:max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="p-2 xs:p-3 sm:p-4 lg:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-color)]">
                    إضافة تبرع جديد
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <AddDonationForm
                  onCancel={() => setShowAddForm(false)}
                  onSubmit={handleAddDonation}
                />
              </div>
            </div>
          </div>
        )}

        {/* Donation Details Modal */}
        {/* Removed DonationDetailsModal */}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        
        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        
        .dark .custom-scrollbar {
          scrollbar-color: #4b5563 transparent;
        }
        
        /* Smooth scrolling */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default DonationsPage;
