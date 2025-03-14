import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ContestQuestionsManager from './contest-questions/ContestQuestionsManager';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import QuestionBankManager from './question-bank/QuestionBankManager';
import GlobalSettings from './GlobalSettings';
import UserManager from './users/UserManager';
import AdminWinnersList from './winners/WinnersList';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/contests" element={<AdminDashboard />} />
      <Route path="/contests/:contestId/questions" element={<ContestQuestionsManager />} />
      <Route path="/questions" element={<QuestionBankManager />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route path="/settings" element={<GlobalSettings />} />
      <Route path="/users" element={<UserManager />} />
      <Route path="/winners" element={<AdminWinnersList />} />
    </Routes>
  );
};

export default AdminRoutes;