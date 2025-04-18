import { Routes, Route } from "react-router-dom";
import axios from "axios";

// Contexts
import { CartProvider } from "./context/CartContext";
import ThemeContextProvider from "./context/ThemeContextProvider";


import { Hero } from "./components/common/Hero";

import Browsing from "./components/user/Browsing";
import Cart from "./components/user/Cart";
import HomePage from "./components/common/HomePage";
import AuthPage from "./components/common/AuthPage";
import Profile from "./components/user/pages/Profile";
import BookingPage from "./components/user/pages/BookingPage";
import InvoicePage from "./components/user/pages/InvoicePage";

// Service Provider Dashboard
import Layout from "./components/serviceprovider/components/Layout";
import Dashboard from "./components/serviceprovider/components/Dashboard";
import Appointments from "./components/serviceprovider/components/AppointmentsPage";
import ClientsPage from "./components/serviceprovider/components/ClientsPage";
import PaymentsPage from "./components/serviceprovider/components/PaymentsPage";
import SchedulePage from "./components/serviceprovider/components/SchedulePage";
import ServicesPage from "./components/serviceprovider/components/ServicesPage";
import SettingsPage from "./components/serviceprovider/components/SettingsPage";
// Admin Dashboard Pages (from v0.dev)
import AdminLayout from "./components/admin/components/AdminLayout";
import DashboardPage from "./components/admin/components/AdminDashboard";
import AdminAppointmentsPage from "./components/admin/components/AdminAppointmentsPage";
import AdminUsersPage from "./components/admin/components/AdminUsersPage";
import AdminPaymentsPage from "./components/admin/components/AdminPaymentsPage";
import AdminInvoicesPage from "./components/admin/components/AdminInvoicesPage";
import AdminServicesPage from "./components/admin/components/AdminServicesPage";
import AdminProvidersPage from "./components/admin/components/AdminProvidersPage";
import AdminSettingsPage from "./components/admin/components/AdminSettingsPage";
import AdminAuth from "./components/admin/components/AdminAuth";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";

  return (
    <>
      {/* Font imports */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>

      <ThemeContextProvider>
        <CartProvider>
          <Routes>
            {/* ✅ PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/home" element={<Hero />} />
            <Route path="/browse" element={<Browsing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/authpage" element={<AuthPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/invoice" element={<InvoicePage />} />

            {/* ✅ ADMIN DASHBOARD ROUTES (wrapped in Layout) */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              }
            />
            <Route path="/adminauth" element={<AdminAuth />} />
            <Route
              path="appointments"
              element={
                <AdminLayout>
                  <AdminAppointmentsPage />
                </AdminLayout>
              }
            />
            <Route
              path="users"
              element={
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              }
            />
            <Route
              path="payments"
              element={
                <AdminLayout>
                  <AdminPaymentsPage />
                </AdminLayout>
              }
            />
            <Route
              path="providers"
              element={
                <AdminLayout>
                  <AdminProvidersPage />
                </AdminLayout>
              }
            />
            <Route
              path="services"
              element={
                <AdminLayout>
                  <AdminServicesPage />
                </AdminLayout>
              }
            />
            <Route
              path="invoices"
              element={
                <AdminLayout>
                  <AdminInvoicesPage />
                </AdminLayout>
              }
            />
            <Route
              path="settings"
              element={
                <AdminLayout>
                  <AdminSettingsPage />
                </AdminLayout>
              }
            />

            {/* SERVICE PROVIDER DASHBOARD */}
            <Route
              path="/provider"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/provider/appointments"
              element={
                <Layout>
                  <Appointments />
                </Layout>
              }
            />
            <Route
              path="/provider/clients"
              element={
                <Layout>
                  <ClientsPage />
                </Layout>
              }
            />
            <Route
              path="/provider/services"
              element={
                <Layout>
                  <ServicesPage />
                </Layout>
              }
            />
            <Route
              path="/provider/schedule"
              element={
                <Layout>
                  <SchedulePage />
                </Layout>
              }
            />
            <Route
              path="/provider/payments"
              element={
                <Layout>
                  <PaymentsPage />
                </Layout>
              }
            />
            <Route
              path="/provider/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />
            
          </Routes>
        </CartProvider>
      </ThemeContextProvider>
    </>
  );
}

export default App;
