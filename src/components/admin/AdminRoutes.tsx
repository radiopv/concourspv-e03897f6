import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ContestPrizeManager from './ContestPrizeManager';
import DrawManager from './DrawManager';
import AdminContestManager from './AdminContestManager';
import ContentValidator from './ContentValidator';
import GlobalSettings from './GlobalSettings';
import QuestionBank from '@/pages/QuestionBank';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
        <p className="mb-4">Vous devez être connecté pour accéder à l'administration.</p>
        <Button onClick={() => navigate('/login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/contests')}
            >
              Concours
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/questions')}
            >
              Questions
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/settings')}
            >
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route 
            path="/contests/*" 
            element={
              <AdminContestManager 
                onContestSelect={setSelectedContestId}
              />
            } 
          />
          <Route 
            path="/contest/:contestId/prizes" 
            element={
              <ContestPrizeManager 
                contestId={selectedContestId || ''} 
              />
            } 
          />
          <Route 
            path="/contest/:contestId/draw" 
            element={
              <DrawManager 
                contestId={selectedContestId || ''} 
              />
            } 
          />
          <Route path="/content" element={<ContentValidator />} />
          <Route path="/settings" element={<GlobalSettings />} />
          <Route path="/questions" element={<QuestionBank />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;