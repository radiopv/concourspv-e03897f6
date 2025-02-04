import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import ProfileCard from '@/components/dashboard/ProfileCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Helmet>
        <title>{"Tableau de bord"}</title>
      </Helmet>
      
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <ProfileCard userId={user?.id || ''} />
        </div>
        
        <div className="md:col-span-8 space-y-6">
          <StatsCards stats={{ contests_participated: 0, contests_won: 0 }} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;