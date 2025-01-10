import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Grid, Users, Settings, Database, Edit } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ContestPrizeManager from './ContestPrizeManager';
import DrawManager from './DrawManager';
import AdminContestManager from './AdminContestManager';
import ContentValidator from './ContentValidator';
import GlobalSettings from './GlobalSettings';
import QuestionBank from '@/pages/QuestionBank';
import UserManager from './users/UserManager';
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

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Concours', path: '/admin/contests' },
    { icon: Database, label: 'Questions', path: '/admin/questions' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto py-4">
            {adminLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate(link.path)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route 
            path="/contests/*" 
            element={<AdminContestManager onContestSelect={setSelectedContestId} />} 
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
          <Route path="/users" element={<UserManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;