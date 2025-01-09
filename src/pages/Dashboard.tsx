import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import PointsOverview from "@/components/dashboard/PointsOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import ProfileCard from "@/components/dashboard/ProfileCard";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('members')
        .select('total_points, contests_participated, contests_won')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return {
        contests_participated: data?.contests_participated || 0,
        total_points: data?.total_points || 0,
        contests_won: data?.contests_won || 0,
      };
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
      });
      setLoading(false);
    }
  }, [profileData]);

  if (loading || isLoadingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      <StatsCards stats={stats || {
        contests_participated: 0,
        total_points: 0,
        contests_won: 0,
      }} />
      <PointsOverview />
      <QuickActions />
      <ProfileCard 
        userProfile={profileData}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        setIsEditing={setIsEditing}
        userId={user?.id || ''}
        refetch={refetch}
      />
    </div>
  );
};

export default Dashboard;