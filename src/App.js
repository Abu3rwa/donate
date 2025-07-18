import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "./contexts/ThemeContext";

// Import components
import Layout from "./components/Layout/Layout";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/about/AboutPage";
import CampaignsPage from "./pages/campaignsPage/CampaignsPage";
import StoriesPage from "./pages/StoriesPage";
import DonationsPage from "./pages/donationsPage/DonationsPage";
import VolunteerPage from "./pages/VolunteerPage";
import CampaignDetailsPage from "./pages/compaign-details/CampaignDetailsPage";
import ImpactPage from "./pages/ImpactPage";
import ContactPage from "./pages/ContactPage";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DebugPage from "./pages/DebugPage";
// import OrganizationInfoPage from "./pages/OrganizationInfoPage";

// Import auth components

// Import dashboard components
import PrivateRoute from "./components/auth/PrivateRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
// import UsersManagement from "./components/dashboard/UsersManagement";

// Import contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider as ContextThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { LanguageProvider } from "./contexts/LanguageContext";
// Removed OrganizationInfoProvider and useOrganizationInfo

// Import constants

import { toastOptions } from "./theme/theme";
import HomeNavigation from "./pages/home/HomeNavigation";
import HomeFooter from "./pages/home/HomeFooter";
import SettingsPage from "./pages/setting/SettingsPage";
import OrganizationInfoPage from "./pages/OrganizationInfoPage";
import VisitorDonationsPage from "./pages/visitor-donations-page/VisitorDonationsPage";
import NonMemberDonatePage from "./pages/visitor-donations-page/NonMemberDonatePage";

import AddUserForm from "./pages/userManagement/AddUserForm";

// Import theme exports

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ContextThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <Router>
                  <AppContent />
                </Router>
              </NotificationProvider>
            </AuthProvider>
          </ContextThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

// Separate component for the main app content with conditional payment providers
function AppContent() {
  const { getCurrentTheme } = useTheme();
  const theme = getCurrentTheme();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  // If you need orgInfo here, fetch it using getOrgInfo and local state as in other components.

  return (
    <ThemeProvider theme={theme}>
      {!isDashboard && <HomeNavigation />}

      {/* <CssBaseline /> */}
      <div className="App min-h-screen bg-[var(--background-color)]">
        <Layout>
          <Routes>
            <Route path="/organization" element={<OrganizationInfoPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/compaigns/:id" element={<CampaignDetailsPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route
              path="/visitor-donations"
              element={<VisitorDonationsPage />}
            />

            {/* <Route path="/settings" element={<Organiza />} /> */}

            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="add-user" element={<AddUserForm />} />
              {/* <Route path="users" element={<UsersManagement />} /> */}
            </Route>
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/donate" element={<NonMemberDonatePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>

        {/* Toast Notifications */}
        <Toaster position="top-right" toastOptions={toastOptions} />
      </div>
      {!isDashboard && <HomeFooter />}
    </ThemeProvider>
  );
}

export default App;
