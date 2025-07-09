import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import AddDonationForm from "../components/dashboard/AddDonationForm";
import {
  fetchDonations,
  getDonationStats,
  searchDonations,
  exportDonations,
  deleteDonation,
  addDonation,
} from "../services/donationsService";
import { getAllCampaigns } from "../services/compaignService";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DonationsPage = () => {
  const { user, hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const exportRef = useRef(null);

  // State management
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    campaign: searchParams.get("campaign") || "all",
    dateRange: searchParams.get("dateRange") || "all",
    searchTerm: searchParams.get("search") || "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

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

  const loadInitialData = async () => {
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
  };

  const loadDonations = async (isLoadMore = false) => {
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
  };

  const loadStats = async () => {
    try {
      const statsData = await getDonationStats({
        dateRange: filters.dateRange,
        campaign: filters.campaign,
      });
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

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
      await addDonation(donationData);
      setShowAddForm(false);
      loadDonations(); // Reload donations
      loadStats(); // Reload stats
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

  const handleExport = async () => {
    try {
      await exportDonations(filters);
    } catch (error) {
      showError("فشل في تصدير البيانات");
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      // Create a temporary container for export
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '800px';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.padding = '20px';
      exportContainer.style.fontFamily = 'Arial, sans-serif';
      exportContainer.style.direction = 'rtl';
      exportContainer.style.textAlign = 'right';
      
      // Add header with logo and organization name
      const header = document.createElement('div');
      header.style.borderBottom = '2px solid #3cc400';
      header.style.paddingBottom = '20px';
      header.style.marginBottom = '20px';
      header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 50px; height: 50px; background-color: #3cc400; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 15px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">أ</span>
            </div>
            <div>
              <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #333;">
                جمعية عسعس الطاهر
              </h1>
              <p style="font-size: 14px; color: #666; margin: 0;">
                Asaas Al-Tahir Organization
              </p>
            </div>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 12px; color: #666; margin: 0;">
              تاريخ التصدير: ${new Date().toLocaleDateString('ar-SD')}
            </p>
          </div>
        </div>
        <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #333; text-align: center;">
          تقرير التبرعات
        </h2>
      `;
      exportContainer.appendChild(header);

      // Add statistics if available
      if (stats) {
        const statsDiv = document.createElement('div');
        statsDiv.style.marginBottom = '20px';
        statsDiv.style.padding = '15px';
        statsDiv.style.backgroundColor = '#f8f9fa';
        statsDiv.style.borderRadius = '8px';
        statsDiv.style.border = '1px solid #e9ecef';
        statsDiv.innerHTML = `
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; text-align: center;">إحصائيات التبرعات</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">إجمالي التبرعات</p>
              <p style="font-size: 16px; font-weight: bold; color: #28a745; margin: 0;">${new Intl.NumberFormat("ar-SD").format(stats.totalAmount)} ج.س</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">عدد المتبرعين</p>
              <p style="font-size: 16px; font-weight: bold; color: #007bff; margin: 0;">${stats.uniqueDonors}</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">عدد التبرعات</p>
              <p style="font-size: 16px; font-weight: bold; color: #6f42c1; margin: 0;">${stats.totalDonations}</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">متوسط التبرع</p>
              <p style="font-size: 16px; font-weight: bold; color: #fd7e14; margin: 0;">${new Intl.NumberFormat("ar-SD").format(Math.round(stats.averageAmount))} ج.س</p>
            </div>
          </div>
        `;
        exportContainer.appendChild(statsDiv);
      }

      // Create donations table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '20px';
      table.style.border = '1px solid #dee2e6';
      
      // Table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr style="background-color: #3cc400;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">المتبرع</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">رقم الهاتف</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">المبلغ</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">الحملة</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">الحالة</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">التاريخ</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">ملاحظات</th>
        </tr>
      `;
      table.appendChild(thead);

      // Table body
      const tbody = document.createElement('tbody');
      donations.forEach((donation, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        row.innerHTML = `
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.isAnonymous ? "فاعل خير" : donation.donorName}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.donorPhone}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; font-weight: bold; color: #28a745;">${donation.formattedAmount}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${campaigns.find((c) => c.id === donation.campaign)?.name || "غير محدد"}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${getStatusText(donation.status)}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.formattedDate}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.notes || "-"}</td>
        `;
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      exportContainer.appendChild(table);

      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.paddingTop = '15px';
      footer.style.borderTop = '1px solid #dee2e6';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#666';
      footer.innerHTML = `
        <p style="margin: 0;">تم إنشاء هذا التقرير بواسطة نظام إدارة التبرعات</p>
        <p style="margin: 5px 0 0 0;">جمعية عسعس الطاهر - Asaas Al-Tahir Organization</p>
      `;
      exportContainer.appendChild(footer);

      // Add to document temporarily
      document.body.appendChild(exportContainer);

      // Generate PDF
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: exportContainer.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `donations_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(exportContainer);
      showSuccess("تم تصدير البيانات كـ PDF بنجاح!");
    } catch (error) {
      console.error('PDF export error:', error);
      showError("فشل في تصدير PDF");
    } finally {
      setExporting(false);
    }
  };

  const exportToImage = async () => {
    setExporting(true);
    try {
      // Create a temporary container for export
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '800px';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.padding = '20px';
      exportContainer.style.fontFamily = 'Arial, sans-serif';
      exportContainer.style.direction = 'rtl';
      exportContainer.style.textAlign = 'right';
      
      // Add header with logo and organization name
      const header = document.createElement('div');
      header.style.borderBottom = '2px solid #3cc400';
      header.style.paddingBottom = '20px';
      header.style.marginBottom = '20px';
      header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 50px; height: 50px; background-color: #3cc400; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 15px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">أ</span>
            </div>
            <div>
              <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #333;">
                جمعية عسعس الطاهر
              </h1>
              <p style="font-size: 14px; color: #666; margin: 0;">
                Asaas Al-Tahir Organization
              </p>
            </div>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 12px; color: #666; margin: 0;">
              تاريخ التصدير: ${new Date().toLocaleDateString('ar-SD')}
            </p>
          </div>
        </div>
        <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: #333; text-align: center;">
          تقرير التبرعات
        </h2>
      `;
      exportContainer.appendChild(header);

      // Add statistics if available
      if (stats) {
        const statsDiv = document.createElement('div');
        statsDiv.style.marginBottom = '20px';
        statsDiv.style.padding = '15px';
        statsDiv.style.backgroundColor = '#f8f9fa';
        statsDiv.style.borderRadius = '8px';
        statsDiv.style.border = '1px solid #e9ecef';
        statsDiv.innerHTML = `
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; text-align: center;">إحصائيات التبرعات</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">إجمالي التبرعات</p>
              <p style="font-size: 16px; font-weight: bold; color: #28a745; margin: 0;">${new Intl.NumberFormat("ar-SD").format(stats.totalAmount)} ج.س</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">عدد المتبرعين</p>
              <p style="font-size: 16px; font-weight: bold; color: #007bff; margin: 0;">${stats.uniqueDonors}</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">عدد التبرعات</p>
              <p style="font-size: 16px; font-weight: bold; color: #6f42c1; margin: 0;">${stats.totalDonations}</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #666; margin: 0 0 5px 0;">متوسط التبرع</p>
              <p style="font-size: 16px; font-weight: bold; color: #fd7e14; margin: 0;">${new Intl.NumberFormat("ar-SD").format(Math.round(stats.averageAmount))} ج.س</p>
            </div>
          </div>
        `;
        exportContainer.appendChild(statsDiv);
      }

      // Create donations table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '20px';
      table.style.border = '1px solid #dee2e6';
      
      // Table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr style="background-color: #3cc400;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">المتبرع</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">رقم الهاتف</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">المبلغ</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">الحملة</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">الحالة</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">التاريخ</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold; font-size: 14px; color: white;">ملاحظات</th>
        </tr>
      `;
      table.appendChild(thead);

      // Table body
      const tbody = document.createElement('tbody');
      donations.forEach((donation, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        row.innerHTML = `
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.isAnonymous ? "فاعل خير" : donation.donorName}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.donorPhone}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; font-weight: bold; color: #28a745;">${donation.formattedAmount}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${campaigns.find((c) => c.id === donation.campaign)?.name || "غير محدد"}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${getStatusText(donation.status)}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.formattedDate}</td>
          <td style="border: 1px solid #dee2e6; padding: 10px; font-size: 13px; color: #333;">${donation.notes || "-"}</td>
        `;
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      exportContainer.appendChild(table);

      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.paddingTop = '15px';
      footer.style.borderTop = '1px solid #dee2e6';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#666';
      footer.innerHTML = `
        <p style="margin: 0;">تم إنشاء هذا التقرير بواسطة نظام إدارة التبرعات</p>
        <p style="margin: 5px 0 0 0;">جمعية عسعس الطاهر - Asaas Al-Tahir Organization</p>
      `;
      exportContainer.appendChild(footer);

      // Add to document temporarily
      document.body.appendChild(exportContainer);

      // Generate image
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: exportContainer.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `donations_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      // Clean up
      document.body.removeChild(exportContainer);
      showSuccess("تم تصدير البيانات كـ صورة بنجاح!");
    } catch (error) {
      console.error('Image export error:', error);
      showError("فشل في تصدير الصورة");
    } finally {
      setExporting(false);
    }
  };

  const showExportOptions = () => {
    // Create a simple modal for export options
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">اختر نوع التصدير</h3>
        <div class="space-y-3">
          <button id="export-csv" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            تصدير كـ CSV
          </button>
          <button id="export-pdf" class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            تصدير كـ PDF
          </button>
          <button id="export-image" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            تصدير كـ صورة
          </button>
          <button id="cancel-export" class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('#export-csv').addEventListener('click', () => {
      document.body.removeChild(modal);
      handleExport();
    });

    modal.querySelector('#export-pdf').addEventListener('click', () => {
      document.body.removeChild(modal);
      exportToPDF();
    });

    modal.querySelector('#export-image').addEventListener('click', () => {
      document.body.removeChild(modal);
      exportToImage();
    });

    modal.querySelector('#cancel-export').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

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
    <div className="min-h-screen bg-[var(--background-color)] p-2 sm:p-4" dir="rtl">
      <div className="max-w-7xl mx-auto" ref={exportRef}>
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-2">
              إدارة التبرعات
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-color-secondary)]">
              عرض وإدارة جميع التبرعات في النظام
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {hasPermission("manage_donations") && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto bg-[#3cc400] text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-[#216c00] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة تبرع جديد
              </button>
            )}
            <button
              onClick={showExportOptions}
              disabled={exporting}
              className="w-full sm:w-auto bg-gray-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {exporting ? "جاري التصدير..." : "تصدير"}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="mr-3 sm:mr-4">
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-color-secondary)]">إجمالي التبرعات</p>
                  <p className="text-lg sm:text-2xl font-bold text-[var(--text-color)]">
                    {new Intl.NumberFormat("ar-SD").format(stats.totalAmount)} ج.س
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="mr-3 sm:mr-4">
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-color-secondary)]">عدد المتبرعين</p>
                  <p className="text-lg sm:text-2xl font-bold text-[var(--text-color)]">{stats.uniqueDonors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="mr-3 sm:mr-4">
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-color-secondary)]">عدد التبرعات</p>
                  <p className="text-lg sm:text-2xl font-bold text-[var(--text-color)]">{stats.totalDonations}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="mr-3 sm:mr-4">
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-color-secondary)]">متوسط التبرع</p>
                  <p className="text-lg sm:text-2xl font-bold text-[var(--text-color)]">
                    {new Intl.NumberFormat("ar-SD").format(Math.round(stats.averageAmount))} ج.س
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                      const timeoutId = setTimeout(() => handleSearch(value), 500);
                      return () => clearTimeout(timeoutId);
                    } else {
                      loadDonations();
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-sm"
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
                className="w-full  text-center  px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-sm"
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
                className="w-full  text-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3cc400] focus:border-transparent bg-[var(--background-color)] text-[var(--text-color)] text-sm"
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
                  className={`px-2  text-center sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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

        {/* Donations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
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
                  <tr key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--text-color)]">
                          {donation.isAnonymous ? "فاعل خير" : donation.donorName}
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
                        {campaigns.find((c) => c.id === donation.campaign)?.name || "غير محدد"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {getStatusText(donation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color-secondary)]">
                      {donation.formattedDate}
                    </td>
                    {hasPermission("manage_donations") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            className="text-[#3cc400] hover:text-[#216c00] transition-colors"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => handleDeleteDonation(donation.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            حذف
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
            {donations.map((donation) => (
              <div key={donation.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-[var(--text-color)]">
                        {donation.isAnonymous ? "فاعل خير" : donation.donorName}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {getStatusText(donation.status)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-color-secondary)] mb-1">
                      {donation.donorPhone}
                    </p>
                    <p className="text-xs text-[var(--text-color-secondary)]">
                      {campaigns.find((c) => c.id === donation.campaign)?.name || "غير محدد"}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="text-xs text-[#3cc400] hover:text-[#216c00] transition-colors px-2 py-1 rounded"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => handleDeleteDonation(donation.id)}
                        className="text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded"
                      >
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
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-[var(--text-color)]">لا توجد تبرعات</h3>
              <p className="mt-1 text-sm text-[var(--text-color-secondary)]">
                {filters.searchTerm ? "لا توجد نتائج للبحث المحدد" : "لم يتم العثور على أي تبرعات بعد"}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && donations.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-color)]">إضافة تبرع جديد</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        {selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm sm:max-w-md">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-color)]">تفاصيل التبرع</h2>
                  <button
                    onClick={() => setSelectedDonation(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">المتبرع</label>
                    <p className="text-sm sm:text-base text-[var(--text-color)]">{selectedDonation.donorName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">رقم الهاتف</label>
                    <p className="text-sm sm:text-base text-[var(--text-color)]">{selectedDonation.donorPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">المبلغ</label>
                    <p className="text-sm sm:text-base text-[var(--text-color)] font-bold">{selectedDonation.formattedAmount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">الحملة</label>
                    <p className="text-sm sm:text-base text-[var(--text-color)]">
                      {campaigns.find((c) => c.id === selectedDonation.campaign)?.name || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">الحالة</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDonation.status)}`}>
                      {getStatusText(selectedDonation.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color-secondary)]">التاريخ</label>
                    <p className="text-sm sm:text-base text-[var(--text-color)]">{selectedDonation.formattedDate}</p>
                  </div>
                  {selectedDonation.notes && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color-secondary)]">ملاحظات</label>
                      <p className="text-sm sm:text-base text-[var(--text-color)]">{selectedDonation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsPage;
