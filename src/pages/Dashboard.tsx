import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import ProfileCard from '@/components/dashboard/ProfileCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    street_address: '',
    city: '',
    postal_code: '',
    country: 'France'
  });

  const { data: userProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not found');
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
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

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Tableau de bord</title>
      </Helmet>
      
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          {userProfile && (
            <ProfileCard 
              userProfile={userProfile}
              userId={user?.id || ''}
              refetch={refetch}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
        
        <div className="md:col-span-8 space-y-6">
          <StatsCards stats={stats || { contests_participated: 0, total_points: 0, contests_won: 0 }} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;