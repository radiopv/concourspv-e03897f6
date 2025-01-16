import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import ProfileCard from '@/components/dashboard/ProfileCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import PointsOverview from '@/components/dashboard/PointsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Database, Grid, Users, Settings, Gift, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    notifications_enabled: true,
    share_scores: true
  });

  const { data: userProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points, current_streak, best_streak')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return {
        total_points: data?.total_points || 0,
        contests_participated: data?.current_streak || 0,
        contests_won: data?.best_streak || 0
      };
    },
    enabled: !!user?.id
  });

  const isAdmin = userProfile?.role === 'admin';

  const adminLinks = [
    { icon: Grid, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Concours', path: '/admin/contests' },
    { icon: Database, label: 'Questions', path: '/admin/questions' },
    { icon: Gift, label: 'Prix', path: '/admin/prizes' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="space-y-8">
      <Helmet>
        <title>{"Tableau de bord"}</title>
      </Helmet>
      
      <DashboardHeader />
      
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {adminLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate(link.path)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <ProfileCard 
            userProfile={userProfile}
            userId={user?.id || ''}
            refetch={refetch}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        
        <div className="md:col-span-8 space-y-6">
          <StatsCards stats={stats || { contests_participated: 0, total_points: 0, contests_won: 0 }} />
          <QuickActions />
          <PointsOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;