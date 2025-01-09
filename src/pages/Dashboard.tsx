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
import { initializeUserPoints } from "@/services/pointsService";

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

  // Initialize user data if it doesn't exist
  const initializeUserData = async (userId: string) => {
    try {
      console.log('Checking and initializing user data if needed...');
      
      // Check if member record exists
      const { data: memberData, error: memberCheckError } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .single();

      if (memberCheckError && memberCheckError.code === 'PGRST116') {
        console.log('Member record not found, creating...');
        const { error: createMemberError } = await supabase
          .from('members')
          .insert({
            id: userId,
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || '',
            email: user?.email || '',
            total_points: 0,
            contests_participated: 0,
            contests_won: 0,
          });

        if (createMemberError) {
          console.error('Error creating member:', createMemberError);
          throw createMemberError;
        }
      }

      // Check if user points record exists
      const { data: pointsData, error: pointsCheckError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (pointsCheckError && pointsCheckError.code === 'PGRST116') {
        console.log('User points record not found, creating...');
        await initializeUserPoints(userId);
      }

      console.log('User data initialization complete');
    } catch (error) {
      console.error('Error initializing user data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation de vos données.",
      });
    }
  };

  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Try to initialize user data if needed
      await initializeUserData(user.id);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    retry: 1,
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
    retry: 1,
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