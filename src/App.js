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
import ThemeSwitcher from "./components/ThemeSwitcher";
import Layout from "./components/Layout/Layout";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/about/AboutPage";
import CampaignsPage from "./pages/CampaignsPage";
import StoriesPage from "./pages/StoriesPage";
  import DonationsPage from "./pages/DonationsPage";
import VolunteerPage from "./pages/VolunteerPage";
import ImpactPage from "./pages/ImpactPage";
import ContactPage from "./pages/ContactPage";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminFixPage from "./pages/AdminFixPage";
import DebugPage from "./pages/DebugPage";
import DonatePage from "./pages/DonatePage/DonatePage";
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
import { OrganizationInfoProvider } from "./contexts/OrganizationInfoContext";

// Import constants

import { toastOptions } from "./theme/theme";

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
                <OrganizationInfoProvider>
                  <Router>
                    <AppContent />
                  </Router>
                </OrganizationInfoProvider>
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App min-h-screen bg-[var(--background-color)]">
        {!isDashboard && <ThemeSwitcher />}
        {!isDashboard && <Navigation  />}

        <Layout>
          <Routes>
            {/* <Route path="/organization" element={<OrganizationInfoPage />} /> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              {/* <Route path="users" element={<UsersManagement />} /> */}
            </Route>
            <Route path="/admin-fix" element={<AdminFixPage />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        {!isDashboard && <Footer />}
        {/* Toast Notifications */}
        <Toaster position="top-right" toastOptions={toastOptions} />
      </div>
    </ThemeProvider>
  );
}

export default App;
