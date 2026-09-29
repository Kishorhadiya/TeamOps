import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard';

export default function App() {
  return (
    <Routes>
      {/* ── Admin Portal Route (Only accessible at /admin) */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* ── Employee Portal Routes (Default public & employee entry) */}
      <Route path="/employee/*" element={<EmployeeDashboard />} />
      <Route path="/" element={<EmployeeDashboard />} />

      {/* ── Catch all / redirect to home employee portal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
