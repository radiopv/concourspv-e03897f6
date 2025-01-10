import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminContestManager from './AdminContestManager';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import EditQuestionsList from './EditQuestionsList';
import UserManager from './users/UserManager';
import GlobalSettings from './GlobalSettings';
import ContentValidator from './ContentValidator';

const AdminRoutes = () => {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/contests/*" element={<AdminContestManager onContestSelect={() => {}} />} />
        <Route path="/prizes" element={<PrizeCatalogManager />} />
        <Route path="/questions" element={<EditQuestionsList />} />
        <Route path="/users" element={<UserManager />} />
        <Route path="/settings" element={<GlobalSettings />} />
        <Route path="/content" element={<ContentValidator />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;