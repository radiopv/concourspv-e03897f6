import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import EditContestForm from './EditContestForm';
import ContestList from './contest-list/ContestList';
import Dashboard from './dashboard/Dashboard';
import QuestionForm from './QuestionForm';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route path="/contests" element={<ContestList />} />
      <Route 
        path="/contests/:contestId" 
        element={
          <EditContestFormWrapper />
        }
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

export default AdminRoutes;