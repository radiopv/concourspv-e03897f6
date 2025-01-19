import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import EditContestForm from './EditContestForm';
import AdminDashboard from './AdminDashboard';
import QuestionForm from './QuestionForm';
import AdminContestManager from './AdminContestManager';
import QuestionsManager from './QuestionsManager';

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
        element={<QuestionsManager contestId="" />}
      />
      <Route 
        path="/questions/new" 
        element={
          <QuestionForm 
            question={{
              id: '',
              question_text: '',
              options: [],
              correct_answer: '',
              article_url: '',
              image_url: ''
            }}
            onSave={() => {}}
            onCancel={() => {}}
          />
        }
      />
      <Route 
        path="/questions/:questionId" 
        element={
          <QuestionForm 
            question={{
              id: '',
              question_text: '',
              options: [],
              correct_answer: '',
              article_url: '',
              image_url: ''
            }}
            onSave={() => {}}
            onCancel={() => {}}
          />
        }
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