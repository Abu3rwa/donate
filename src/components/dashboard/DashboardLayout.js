import React from "react";
import { Outlet, Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SideBar from "./SideBar";
import DashboardHeader from "./DashboardHeader";
import { useMediaQuery } from "react-responsive";
import { useSwipeable } from "react-swipeable";
import AddDonationForm from "./AddDonationForm";
import CampaignsPage from "../../pages/CampaignsPage";
import FinancialReportsPage from "../../pages/FinancialReportsPage";
import ExpenseModerationPage from "../../pages/ExpenseModerationPage";
import ExpensesPage from "../../pages/ExpensesPage";
import BillsPage from "../../pages/BillsPage";
import UserManagementPage from "../../pages/UserManagementPage";
import DonationsPage from "../../pages/DonationsPage";
import OrganizationInfoPage from "../../pages/OrganizationInfoPage";
import Dashboard from "./Dashboard";
import BottomNav from "./BottomNav";
// import UsersManagement from "./UsersManagement";

const DashboardLayout = () => {
  const { user, logout, isAdmin, hasPermission } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  
 


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && isSidebarOpen && closeSidebar(),
    onSwipedRight: () => !isMobile && !isSidebarOpen && toggleSidebar(),
    trackMouse: true,
  });
  React.useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location.pathname, isMobile]);

  React.useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen, isMobile]);

  React.useEffect(() => {
    if (window.innerWidth < 800) {
      closeSidebar();
    }
  }, [isMobile]);

  const navigationItems = [
    {
      name: "نظرة عامة",
      href: "/dashboard",
      icon: (  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg>

       ),
    },
    {
      name: "التبرعات",
      href: "/dashboard/donations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg>

      ),
    },
    {
      name: "الحملات",
      href: "/dashboard/campaigns",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg>

      ),
    },
    {
      name: "الوضع المالي",
      href: "/dashboard/financial-reports",
          icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg>

      ),
    },
    {
      name: "معلومات الجمعية",
      href: "/dashboard/organization-info",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]" {...swipeHandlers}>
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        ></div>
      )}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        user={user}
        onLogout={logout}
        navigationItems={navigationItems}
      />
      <div className="flex-1 flex flex-col lg:mr-64 pt-20">
        <DashboardHeader
          onMenuClick={toggleSidebar}
          user={user}
          logout={logout}
            hasPermission={useAuth().hasPermission}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 pt-10">
          <Routes>
            <Route path="add-donation" element={<AddDonationForm />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="donations" element={<DonationsPage />} />
            <Route path="organization-info" element={<OrganizationInfoPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="content-moderation" element={<ExpenseModerationPage />} />
            <Route path="financial-reports" element={<FinancialReportsPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Outlet />} />
          </Routes>
        </main>
        <BottomNav
          user={user}
          hasPermission={useAuth().hasPermission}
          onAddDonation={() => navigate("/dashboard/add-donation")}
          onShowFinancialReports={() => navigate("/dashboard/financial-reports")}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;