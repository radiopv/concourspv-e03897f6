import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrizeCatalogManager from './prize-catalog/PrizeCatalogManager';
import EditContestForm from './EditContestForm';
import ContestList from './ContestList';
import ContestForm from './ContestForm';
import ContestQuestionManager from './ContestQuestionManager';
import ParticipantList from './ParticipantList';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import Dashboard from './Dashboard';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/prizes" element={<PrizeCatalogManager />} />
      <Route path="/contests" element={<ContestList />} />
      <Route path="/contests/new" element={<ContestForm />} />
      <Route path="/contests/:contestId" element={<EditContestForm />} />
      <Route path="/contests/:contestId/questions" element={<ContestQuestionManager />} />
      <Route path="/contests/:contestId/participants" element={<ParticipantList />} />
      <Route path="/questions" element={<QuestionList />} />
      <Route path="/questions/new" element={<QuestionForm />} />
      <Route path="/questions/:questionId" element={<QuestionForm />} />
    </Routes>
  );
};

export default AdminRoutes;