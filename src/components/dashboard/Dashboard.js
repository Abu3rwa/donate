import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import ErrorBoundary from "../ErrorBoundary";
import RecentDonations from "./RecentDonations";
import CampaignProgress from "./CampaignProgress";
import ActivityFeed from "./ActivityFeed";
import { Link, useNavigate } from "react-router-dom";

import {
  listenDashboardStats,
  listenRecentDonations,
  listenCampaigns,
  listenActivityFeed,
} from "../../services/dashboardService";
import { useMediaQuery } from "react-responsive";
import { Badge } from "lucide-react";

const PAGE_SIZE = 10;

const Dashboard = () => {
  const { user, isAdmin, hasPermission } = useAuth();
  const {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showNetworkError,
    showDonationSuccess,
  } = useNotification();
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [donationPage, setDonationPage] = useState(1);
  const [hasMoreDonations, setHasMoreDonations] = useState(true);

  const lastDonationId = useRef(null);
  const lastActivityId = useRef(null);
  const lastCampaignProgress = useRef({}); // Track previous campaign progress

  // Memoize donations for current page
  const paginatedDonations = useMemo(
    () => recentDonations.slice(0, donationPage * PAGE_SIZE),
    [recentDonations, donationPage]
  );

  const handleLoadMoreDonations = useCallback(() => {
    if (paginatedDonations.length < recentDonations.length) {
      setDonationPage((p) => p + 1);
    } else {
      setHasMoreDonations(false);
    }
  }, [paginatedDonations.length, recentDonations.length]);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [donationsOpen, setDonationsOpen] = useState(!isMobile);
  const [campaignsOpen, setCampaignsOpen] = useState(!isMobile);
  const [activityOpen, setActivityOpen] = useState(!isMobile);

  const navigate = useNavigate();

  useEffect(() => {
    setDonationsOpen(!isMobile);
    setCampaignsOpen(!isMobile);
    setActivityOpen(!isMobile);
  }, [isMobile]);

  // --- Connection/Offline State Handling ---
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showInfo("تم استعادة الاتصال بالإنترنت.");
    };
    const handleOffline = () => {
      setIsOffline(true);
      showNetworkError();
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showNetworkError, showInfo]);

  // --- Real-time Listeners & Notifications ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubDonations = listenRecentDonations(
      (data) => {
        setRecentDonations(data);
        if (data.length && data[0].id !== lastDonationId.current) {
          if (lastDonationId.current) {
            showDonationSuccess(data[0].amount, "جنيه");
          }
          lastDonationId.current = data[0].id;
        }
      },
      (err) => {
        setError(err.message);
        showNetworkError();
      }
    );
    const unsubCampaigns = listenCampaigns(
      (data) => {
        setCampaigns(data);
        // --- Campaign Milestone Toasts ---
        data.forEach((campaign) => {
          const prev = lastCampaignProgress.current[campaign.id] || 0;
          const curr = campaign.progress;
          const milestones = [25, 50, 75, 100];
          milestones.forEach((milestone) => {
            if (prev < milestone && curr >= milestone) {
              showSuccess(
                `🎉 الحملة "${campaign.name}" وصلت إلى ${milestone}% من الهدف!`
              );
            }
          });
          lastCampaignProgress.current[campaign.id] = curr;
        });
      },
      (err) => {
        setError(err.message);
        showNetworkError();
      }
    );
    const unsubActivities = listenActivityFeed(
      (data) => {
        setActivities(data);
        if (data.length && data[0].id !== lastActivityId.current) {
          if (lastActivityId.current) {
            showInfo(`نشاط جديد: ${data[0].message}`);
          }
          lastActivityId.current = data[0].id;
        }
      },
      (err) => {
        setError(err.message);
        showNetworkError();
      }
    );

    setLoading(false);

    return () => {
      unsubDonations();
      unsubCampaigns();
      unsubActivities();
    };
  }, [showSuccess, showInfo, showNetworkError, showDonationSuccess]);

  // --- Optimistic Update Example (Scaffold) ---
  // Usage: Call optimisticAddDonation or optimisticUpdateCampaign in admin actions
  const optimisticAddDonation = (donation) => {
    // Optimistically add to UI
    setRecentDonations((prev) => [donation, ...prev]);
    // Firestore add logic here...
    // On error, rollback:
    // setRecentDonations((prev) => prev.filter(d => d.id !== donation.id));
  };
  const optimisticUpdateCampaign = (campaignId, update) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...update } : c))
    );
    // Firestore update logic here...
    // On error, rollback:
    // setCampaigns((prev) => prev.map(c => c.id === campaignId ? { ...c, ...revertUpdate } : c));
  };

  const handleShowFinancialReports = () => {
    navigate("/dashboard/financial-reports");
  };

  if (loading) {
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

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900">
  //       <div className="text-center">
  //         <p className="text-red-700 dark:text-red-200">حدث خطأ: .. {error}</p>
  //       </div>
  //     </div>
  //   );
  // }

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
    <ErrorBoundary>
      {/*  welcome and greeting message to the admin use the theme variables  */}
      <div
        className="mb-8 rounded-lg p-6   bg-[var(--paper-color)] border border-gray-200 dark:border-gray-700 flex items-center gap-4"
        style={{
          background: "var(--paper-color)",
          color: "var(--text-primary)",
        }}
      >
         
        <div>
          <h6 className="  font-bold mb-1 text-[var(--text-primary)]">
              {user?.displayName ? user.displayName : ""}  
          </h6>
          {/* add role with badge   */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700">
            {user?.adminType === "super_admin" ? "مدير عام" : "مدير"}
            <svg className="w-4 h-4 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            
          </span>
          
          
         
          <p className="text-gray-600 dark:text-gray-300">
         يمكنك إدارة التبرعات، الحملات، والمزيد من هنا.
          </p>
        </div>
      </div>
      

      

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions
          user={user}
          hasPermission={hasPermission}
          onShowFinancialReports={handleShowFinancialReports}
        />
      </div>

       {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStats data={stats} />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         {hasPermission("manage_donations") && (
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  آخر التبرعات
                </h2>
                <button
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ minWidth: 44, minHeight: 44 }}
                  onClick={() => setDonationsOpen((open) => !open)}
                  aria-expanded={donationsOpen}
                  aria-controls="recent-donations-section"
                >
                  {donationsOpen ? "إخفاء" : "عرض"}
                </button>
              </div>
              {donationsOpen && (
                <Suspense fallback={<div>جاري تحميل التبرعات...</div>}>
                  <RecentDonations
                    donations={paginatedDonations}
                    onLoadMore={handleLoadMoreDonations}
                    hasMore={hasMoreDonations}
                  />
                </Suspense>
              )}
            </div>
          </div>
        )}
         {hasPermission("manage_campaigns") && (
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  تقدم الحملات
                </h2>
                <button
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ minWidth: 44, minHeight: 44 }}
                  onClick={() => setCampaignsOpen((open) => !open)}
                  aria-expanded={campaignsOpen}
                  aria-controls="campaign-progress-section"
                >
                  {campaignsOpen ? "إخفاء" : "عرض"}
                </button>
              </div>
              {campaignsOpen && (
                <Suspense fallback={<div>جاري تحميل الحملات...</div>}>
                  <CampaignProgress campaigns={campaigns} />
                </Suspense>
              )}
            </div>
          </div>
        )}
      </div> */}

      
    </ErrorBoundary>
  );
};

export default Dashboard;
