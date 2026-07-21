import React from 'react';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../Shell/AppShell';
import LoginPage from '../../pages/Login/LoginPage';
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import ChatPage from '../../pages/Chat/ChatPage';
import CasesRegistryPage from '../../pages/Cases/CasesRegistryPage';
import AccusedPage from '../../pages/Accused/AccusedPage';
import AnalyticsPage from '../../pages/Analytics/AnalyticsPage';
import EvidencePage from '../../pages/Evidence/EvidencePage';
import ReportsPage from '../../pages/Reports/ReportsPage';
import NotificationsPage from '../../pages/Notifications/NotificationsPage';
import SettingsPage from '../../pages/Settings/SettingsPage';
import HelpPage from '../../pages/Help/HelpPage';
import ProfilePage from '../../pages/Profile/ProfilePage';

export default function RootLayout() {
  // Read authentication status from localStorage
  const isAuthenticated = !!localStorage.getItem('ksp-token');

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="cases" element={<CasesRegistryPage />} />
        <Route path="fir" element={<CasesRegistryPage />} />
        <Route path="accused" element={<AccusedPage />} />
        <Route path="victims" element={<CasesRegistryPage />} />
        <Route path="witnesses" element={<CasesRegistryPage />} />
        
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="hotspots" element={<AnalyticsPage />} />
        <Route path="crime-analytics" element={<AnalyticsPage />} />
        <Route path="network-analysis" element={<AnalyticsPage />} />
        <Route path="financial-crimes" element={<AnalyticsPage />} />
        <Route path="predictions" element={<AnalyticsPage />} />
        
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function ShellOutlet() {
  return <Outlet />;
}

