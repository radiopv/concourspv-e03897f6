import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminContestManager from './AdminContestManager';
import ContentValidator from './ContentValidator';
import GlobalSettings from './GlobalSettings';
import QuestionBank from '@/pages/QuestionBank';
import UserManager from './users/UserManager';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const { user } = useAuth();
  console.log("Current user in AdminRoutes:", user);
  console.log("User role:", user?.role);

  if (!user || user.role !== 'admin') {
    console.log("User not authorized, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/contests/*" element={<AdminContestManager />} />
        <Route path="/prizes" element={<PrizeCatalogManager contestId={null} />} />
        <Route path="/questions" element={<QuestionBank />} />
        <Route path="/users" element={<UserManager />} />
        <Route path="/settings" element={<GlobalSettings />} />
        <Route path="/content" element={<ContentValidator />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;