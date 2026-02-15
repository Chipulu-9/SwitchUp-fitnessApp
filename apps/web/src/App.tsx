/**
 * SwitchUp - Fitness Tracker Application
 * Main App component with routing
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { MainLayout } from './components/layout/MainLayout';
import './style.css';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/workouts"
          element={
            <AuthGuard>
              <MainLayout>
                <WorkoutsPage />
              </MainLayout>
            </AuthGuard>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
