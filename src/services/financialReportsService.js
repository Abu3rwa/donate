import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getCountFromServer,
  startOf,
  endOf,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

// Utility functions
const formatCurrency = (amount) =>
  new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);

const getDateRange = (range) => {
  const now = new Date();
  let start, end = now;
  
  switch (range) {
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { start, end };
};

// 1. Fetch financial statistics
export const fetchFinancialStats = async (dateRange = 'month', customStart = null, customEnd = null) => {
  try {
    const { start, end } = customStart && customEnd 
      ? { start: new Date(customStart), end: new Date(customEnd) }
      : getDateRange(dateRange);

    const donationsRef = collection(db, "donations");
    const donationsQuery = query(
      donationsRef,
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(donationsQuery);
    const donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate statistics
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const completedAmount = donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const pendingAmount = donations
      .filter(d => d.status === 'pending')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const uniqueDonors = new Set(donations.map(d => d.donorEmail)).size;
    const totalDonations = donations.length;
    const completedDonations = donations.filter(d => d.status === 'completed').length;

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      uniqueDonors,
      totalDonations,
      completedDonations,
      dateRange: { start, end },
      rawDonations: donations
    };
  } catch (error) {
    console.error("Error fetching financial stats:", error);
    throw new Error("فشل في تحميل الإحصائيات المالية");
  }
};

// 2. Fetch donations with filters
export const fetchDonations = async (filters = {}) => {
  try {
    const {
      dateRange = 'month',
      customStart = null,
      customEnd = null,
      status = 'all',
      campaign = 'all',
      limit = 100
    } = filters;

    const { start, end } = customStart && customEnd 
      ? { start: new Date(customStart), end: new Date(customEnd) }
      : getDateRange(dateRange);

    let donationsQuery = query(
      collection(db, "donations"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(donationsQuery);
    let donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply filters
    if (status !== 'all') {
      donations = donations.filter(d => d.status === status);
    }
    if (campaign !== 'all') {
      donations = donations.filter(d => d.campaign === campaign);
    }

    return donations.slice(0, limit);
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw new Error("فشل في تحميل التبرعات");
  }
};

// 3. Generate chart data
export const generateChartData = (donations, campaigns = []) => {
  const monthlyData = {};
  const campaignData = {};
  const paymentMethodData = {};
  
  donations.forEach(donation => {
    let dateObj;
    if (donation.createdAt && typeof donation.createdAt.toDate === 'function') {
      dateObj = donation.createdAt.toDate();
    } else if (typeof donation.createdAt === 'string' || typeof donation.createdAt === 'number') {
      dateObj = new Date(donation.createdAt);
    } else {
      dateObj = new Date();
    }
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    
    // Monthly totals
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (donation.amount || 0);
    
    // Campaign totals
    if (donation.campaign) {
      campaignData[donation.campaign] = (campaignData[donation.campaign] || 0) + (donation.amount || 0);
    }
    
    // Payment method totals
    const method = donation.paymentMethod || 'غير محدد';
    paymentMethodData[method] = (paymentMethodData[method] || 0) + (donation.amount || 0);
  });
  
  return {
    monthly: Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month,
        amount,
        label: new Date(month + '-01').toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })
      })),
    campaigns: Object.entries(campaignData)
      .sort(([,a], [,b]) => b - a)
      .map(([campaign, amount]) => ({
        campaign,
        amount,
        label: campaign
      })),
    paymentMethods: Object.entries(paymentMethodData)
      .sort(([,a], [,b]) => b - a)
      .map(([method, amount]) => ({
        method,
        amount,
        label: method
      }))
  };
};

// 4. Fetch campaigns for filtering
export const fetchCampaigns = async () => {
  try {
    const campaignsRef = collection(db, "campaigns");
    const snapshot = await getDocs(campaignsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw new Error("فشل في تحميل الحملات");
  }
};

// 5. Real-time financial data listener
export const listenFinancialData = (filters, onData, onError) => {
  try {
    const {
      dateRange = 'month',
      customStart = null,
      customEnd = null,
      status = 'all',
      campaign = 'all'
    } = filters;

    const { start, end } = customStart && customEnd 
      ? { start: new Date(customStart), end: new Date(customEnd) }
      : getDateRange(dateRange);

    let donationsQuery = query(
      collection(db, "donations"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      donationsQuery,
      async (snapshot) => {
        let donations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Apply filters
        if (status !== 'all') {
          donations = donations.filter(d => d.status === status);
        }
        if (campaign !== 'all') {
          donations = donations.filter(d => d.campaign === campaign);
        }

        // Fetch campaigns for chart data
        const campaigns = await fetchCampaigns();
        
        // Generate chart data
        const chartData = generateChartData(donations, campaigns);
        
        // Calculate statistics
        const stats = {
          totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
          completedAmount: donations
            .filter(d => d.status === 'completed')
            .reduce((sum, d) => sum + (d.amount || 0), 0),
          pendingAmount: donations
            .filter(d => d.status === 'pending')
            .reduce((sum, d) => sum + (d.amount || 0), 0),
          uniqueDonors: new Set(donations.map(d => d.donorEmail)).size,
          totalDonations: donations.length,
          completedDonations: donations.filter(d => d.status === 'completed').length,
        };

        onData({
          donations,
          campaigns,
          chartData,
          stats,
          dateRange: { start, end }
        });
      },
      onError
    );
  } catch (error) {
    console.error("Error setting up financial data listener:", error);
    onError(error);
  }
};

// 6. Export functions
export const exportToCSV = (data, filename = 'financial-report') => {
  try {
    const headers = ['المتبرع', 'المبلغ', 'الحملة', 'طريقة الدفع', 'التاريخ', 'الحالة'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.donorName || 'فاعل خير',
        row.amount || 0,
        row.campaign || 'تبرع عام',
        row.paymentMethod === 'manual_entry' ? 'إدخال يدوي' : row.paymentMethod || 'غير محدد',
        new Date(row.createdAt).toLocaleDateString('ar-EG'),
        row.status === 'completed' ? 'مكتمل' : 
        row.status === 'pending' ? 'قيد المعالجة' : 'فشل'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw new Error("فشل في تصدير البيانات");
  }
};

export const exportToPDF = async (data, filename = 'financial-report') => {
  try {
    // This would integrate with a PDF library like jsPDF
    // For now, we'll create a simple HTML-based PDF
    const htmlContent = `
      <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>التقرير المالي</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>التقرير المالي</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <table>
            <thead>
              <tr>
                <th>المتبرع</th>
                <th>المبلغ</th>
                <th>الحملة</th>
                <th>طريقة الدفع</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  <td>${row.donorName || 'فاعل خير'}</td>
                  <td>${formatCurrency(row.amount || 0)}</td>
                  <td>${row.campaign || 'تبرع عام'}</td>
                  <td>${row.paymentMethod === 'manual_entry' ? 'إدخال يدوي' : row.paymentMethod || 'غير محدد'}</td>
                  <td>${new Date(row.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td>${row.status === 'completed' ? 'مكتمل' : 
                       row.status === 'pending' ? 'قيد المعالجة' : 'فشل'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw new Error("فشل في تصدير البيانات");
  }
};

// 7. Get comparison data (for trends)
export const getComparisonData = async (currentPeriod, previousPeriod) => {
  try {
    const currentData = await fetchFinancialStats(currentPeriod);
    const previousData = await fetchFinancialStats(previousPeriod);
    
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
    return {
      totalAmount: {
        current: currentData.totalAmount,
        previous: previousData.totalAmount,
        trend: calculateTrend(currentData.totalAmount, previousData.totalAmount)
      },
      completedAmount: {
        current: currentData.completedAmount,
        previous: previousData.completedAmount,
        trend: calculateTrend(currentData.completedAmount, previousData.completedAmount)
      },
      uniqueDonors: {
        current: currentData.uniqueDonors,
        previous: previousData.uniqueDonors,
        trend: calculateTrend(currentData.uniqueDonors, previousData.uniqueDonors)
      }
    };
  } catch (error) {
    console.error("Error getting comparison data:", error);
    throw new Error("فشل في تحميل بيانات المقارنة");
  }
};

export default {
  fetchFinancialStats,
  fetchDonations,
  generateChartData,
  fetchCampaigns,
  listenFinancialData,
  exportToCSV,
  exportToPDF,
  getComparisonData
}; 