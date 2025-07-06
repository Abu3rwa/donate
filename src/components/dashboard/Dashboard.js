import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import DashboardStats from "./DashboardStats";
import RecentDonations from "./RecentDonations";
import CampaignProgress from "./CampaignProgress";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";

const Dashboard = () => {
  const { user, isAdmin, hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real data from Firebase
  const [dashboardData] = useState({
    stats: {
      totalDonations: 1250000,
      totalDonors: 342,
      activeCampaigns: 8,
      thisMonthDonations: 180000,
    },
    recentDonations: [
      {
        id: 1,
        donorName: "أحمد محمد",
        amount: 50000,
        campaign: "مساعدة الأسر المحتاجة",
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: 2,
        donorName: "فاطمة علي",
        amount: 25000,
        campaign: "توفير المياه النظيفة",
        date: "2024-01-14",
        status: "completed",
      },
      {
        id: 3,
        donorName: "محمد حسن",
        amount: 75000,
        campaign: "بناء المدارس",
        date: "2024-01-13",
        status: "pending",
      },
    ],
    campaigns: [
      {
        id: 1,
        name: "مساعدة الأسر المحتاجة",
        target: 500000,
        raised: 350000,
        progress: 70,
        status: "active",
      },
      {
        id: 2,
        name: "توفير المياه النظيفة",
        target: 300000,
        raised: 280000,
        progress: 93,
        status: "active",
      },
      {
        id: 3,
        name: "بناء المدارس",
        target: 1000000,
        raised: 620000,
        progress: 62,
        status: "active",
      },
    ],
    activities: [
      {
        id: 1,
        type: "donation",
        message: "تم استلام تبرع جديد بقيمة 50,000 جنيه",
        time: "منذ ساعتين",
        icon: "💰",
      },
      {
        id: 2,
        type: "campaign",
        message: "تم إطلاق حملة جديدة: توفير الأدوية",
        time: "منذ 4 ساعات",
        icon: "🎯",
      },
      {
        id: 3,
        type: "volunteer",
        message: "انضم 5 متطوعين جدد للمشروع",
        time: "منذ 6 ساعات",
        icon: "👥",
      },
    ],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-bold">غير مصرح بالوصول</h2>
            </div>
            <p className="text-sm">
              عذراً، هذه الصفحة متاحة فقط للمديرين. إذا كنت تعتقد أن هذا خطأ،
              يرجى التواصل مع الإدارة.
            </p>
          </div>
          <button onClick={() => window.history.back()} className="btn-primary">
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            إجراءات سريعة
          </h2>
          <QuickActions user={user} hasPermission={hasPermission} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStats data={dashboardData.stats} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Donations */}
        {hasPermission("manage_donations") && (
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  آخر التبرعات
                </h2>
                <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  عرض الكل
                </button>
              </div>
              <RecentDonations donations={dashboardData.recentDonations} />
            </div>
          </div>
        )}
        {/* Campaign Progress */}
        {hasPermission("manage_campaigns") && (
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  تقدم الحملات
                </h2>
                <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  عرض الكل
                </button>
              </div>
              <CampaignProgress campaigns={dashboardData.campaigns} />
            </div>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                النشاطات الأخيرة
              </h2>
              <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                عرض الكل
              </button>
            </div>
            <ActivityFeed activities={dashboardData.activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
