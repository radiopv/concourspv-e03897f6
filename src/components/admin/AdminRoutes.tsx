import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminContestManager from './AdminContestManager';
import ContentValidator from './ContentValidator';
import GlobalSettings from './GlobalSettings';
import QuestionBank from '@/pages/QuestionBank';
import UserManager from './users/UserManager';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
        <p className="mb-4">Vous devez être administrateur pour accéder à cette section.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Se connecter
        </button>
      </div>
    );
  }

  const handleContestSelect = (contestId: string) => {
    navigate(`/admin/contest/${contestId}`);
  };

  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/contests/*" element={<AdminContestManager onContestSelect={handleContestSelect} />} />
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