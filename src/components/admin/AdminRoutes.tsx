import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import EditContestForm from './EditContestForm';
import AdminDashboard from './AdminDashboard';
import AdminContestManager from './AdminContestManager';
import QuestionsManager from './QuestionsManager';
import QuestionBankManager from './question-bank/QuestionBankManager';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route 
        path="/contests" 
        element={<AdminContestManager />}
      />
      <Route 
        path="/contests/:contestId" 
        element={<EditContestFormWrapper />}
      />
      <Route 
        path="/contests/:contestId/questions" 
        element={<QuestionsManagerWrapper />}
      />
      <Route 
        path="/questions" 
        element={<QuestionBankManager />}
      />
    </Routes>
  );
};

// Wrapper component to provide contestId from URL params
const EditContestFormWrapper = () => {
  const { contestId } = useParams();
  return (
    <EditContestForm 
      contestId={contestId || ''} 
      onClose={() => {}}
    />
  );
};

// Wrapper component to provide contestId to QuestionsManager
const QuestionsManagerWrapper = () => {
  const { contestId } = useParams();
  return <QuestionsManager contestId={contestId || ''} />;
};

export default AdminRoutes;