import React, { useState, useEffect } from "react";
import { BarChart3, DollarSign, TrendingUp, Users, RefreshCw } from "lucide-react";
import {
  fetchFinancialStats,
  fetchDonations,
  generateChartData,
  fetchCampaigns,
} from "../services/financialReportsService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);

const formatShortDate = (dateValue) => {
  if (!dateValue) return '-';
  let dateObj;
  if (typeof dateValue === 'object' && dateValue !== null && typeof dateValue.toDate === 'function') {
    dateObj = dateValue.toDate();
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    dateObj = new Date(dateValue);
  } else {
    return '-';
  }
  if (isNaN(dateObj.getTime())) return '-';
  return dateObj.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };
  return (
    <div className={`rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 flex items-center gap-4 ${colorClasses[color]}`}> 
      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        لا توجد بيانات متاحة
      </div>
    );
  }
  const maxValue = Math.max(...data.map((d) => d.amount));
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3 space-x-reverse">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400 truncate">{item.label}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.amount)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.amount / maxValue) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonationTable = ({ donations, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="animate-spin h-6 w-6 text-blue-600" />
        <span className="mr-2 text-gray-600 dark:text-gray-400">جاري التحميل...</span>
      </div>
    );
  }
  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        لا توجد تبرعات في الفترة المحددة
      </div>
    );
  }
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المتبرع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المبلغ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">طريقة الدفع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">التاريخ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{donation.isAnonymous ? 'فاعل خير' : donation.donorName || 'غير محدد'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(donation.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{donation.paymentMethod === 'manual_entry' ? 'إدخال يدوي' : donation.paymentMethod || 'غير محدد'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatShortDate(donation.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    donation.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : donation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {donation.status === 'completed' ? 'مكتمل' : donation.status === 'pending' ? 'قيد المعالجة' : 'فشل'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-[var(--text-color)] text-base">
                {donation.isAnonymous ? 'فاعل خير' : donation.donorName || 'غير محدد'}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                donation.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : donation.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {donation.status === 'completed' ? 'مكتمل' : donation.status === 'pending' ? 'قيد المعالجة' : 'فشل'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[var(--text-color-secondary)]">المبلغ:</span>
              <span className="font-semibold text-[var(--text-color)]">{formatCurrency(donation.amount)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[var(--text-color-secondary)]">طريقة الدفع:</span>
              <span className="text-xs text-[var(--text-color)]">{donation.paymentMethod === 'manual_entry' ? 'إدخال يدوي' : donation.paymentMethod || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[var(--text-color-secondary)]">التاريخ:</span>
              <span className="text-xs text-[var(--text-color)]">{formatShortDate(donation.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const FinancialReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "month",
    campaign: "all",
  });

  useEffect(() => {
    fetchCampaigns().then(setCampaigns).catch(() => setCampaigns([]));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await fetchFinancialStats(filters.dateRange);
      setStats(statsData);
      const donationsData = await fetchDonations(filters);
      setDonations(donationsData);
      const chart = generateChartData(donationsData);
      setChartData(chart.monthly);
    } catch (err) {
      setError("فشل في تحميل البيانات. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters.dateRange, filters.campaign]);

  // Date range options
  const dateRanges = [
    { value: "today", label: "اليوم" },
    { value: "week", label: "هذا الأسبوع" },
    { value: "month", label: "هذا الشهر" },
    { value: "year", label: "هذا العام" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-primary)] p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">التقارير المالية</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">عرض وتحليل البيانات المالية والتبرعات</p>
          </div>
        </header>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">الفترة الزمنية</label>
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
                  onClick={() => setFilters((f) => ({ ...f, dateRange: range.value }))}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    filters.dateRange === range.value
                      ? "bg-[#3cc400] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-[var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-pressed={filters.dateRange === range.value}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الحملة</label>
            <select
              value={filters.campaign}
              onChange={e => setFilters(f => ({ ...f, campaign: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--background-color)] text-[var(--text-color)]"
              aria-label="تصفية حسب الحملة"
            >
              <option value="all">جميع الحملات</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              aria-label="إعادة المحاولة"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="إجمالي التبرعات" value={stats ? formatCurrency(stats.totalAmount) : "-"} icon={DollarSign} color="blue" />
          <StatCard title="المكتملة" value={stats ? formatCurrency(stats.completedAmount) : "-"} icon={TrendingUp} color="green" />
          <StatCard title="قيد المعالجة" value={stats ? formatCurrency(stats.pendingAmount) : "-"} icon={BarChart3} color="yellow" />
          <StatCard title="عدد المتبرعين" value={stats ? stats.uniqueDonors : "-"} icon={Users} color="purple" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تبرعات حسب الشهر</h3>
            <SimpleBarChart data={chartData} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">جدول التبرعات</h3>
            <DonationTable donations={donations} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;
