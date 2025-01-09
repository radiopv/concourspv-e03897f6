import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  // Fonction pour créer un nouveau membre si nécessaire
  const initializeMember = async (userId: string, userEmail: string) => {
    try {
      console.log('Initializing member for user:', userId);
      
      // First, check if member exists
      const { data: existingMember, error: checkError } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking member:', checkError);
        throw checkError;
      }

      if (existingMember) {
        console.log('Member found:', existingMember);
        return existingMember;
      }

      // Get user metadata for names
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user metadata:', userError);
        throw userError;
      }

      const userMetadata = authUser?.user_metadata || {};
      const defaultData = {
        id: userId,
        email: userEmail,
        first_name: userMetadata.first_name || 'New',
        last_name: userMetadata.last_name || 'Member',
        total_points: 0,
        contests_participated: 0,
        contests_won: 0,
        notifications_enabled: true,
        share_scores: true,
      };
      
      // Create new member with all required fields
      console.log('Creating new member with data:', defaultData);
      const { data: newMember, error: createError } = await supabase
        .from('members')
        .insert([defaultData])
        .select()
        .maybeSingle();

      if (createError) {
        console.error('Error creating member:', createError);
        throw createError;
      }

      if (!newMember) {
        throw new Error('Failed to create new member');
      }

      console.log('New member created:', newMember);
      return newMember;
    } catch (error) {
      console.error('Error in initializeMember:', error);
      throw error;
    }
  };

  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id || !user?.email) return null;
      
      console.log('Fetching user profile data...');
      
      // Initialiser ou récupérer le membre
      const member = await initializeMember(user.id, user.email);
      
      // Initialize user points if needed
      await initializeUserPoints(user.id);
      
      return member;
    },
    enabled: !!user?.id && !!user?.email,
    retry: 1,
    staleTime: 300000, // 5 minutes
    gcTime: 3600000, // 1 hour
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching user stats...');
      
      const { data, error } = await supabase
        .from('members')
        .select('total_points, contests_participated, contests_won')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }

      return {
        contests_participated: data?.contests_participated || 0,
        total_points: data?.total_points || 0,
        contests_won: data?.contests_won || 0,
      };
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 300000, // 5 minutes
    gcTime: 3600000, // 1 hour
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
      });
    }
  }, [profileData]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Helmet>
          <title>Connexion requise | Tableau de bord</title>
          <meta name="description" content="Connectez-vous pour accéder à votre tableau de bord personnel et suivre vos performances dans les concours." />
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <h1 className="text-2xl font-bold text-gray-900">
          Veuillez vous connecter pour accéder à votre tableau de bord
        </h1>
      </div>
    );
  }

  const isLoading = isLoadingProfile || isLoadingStats;

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Tableau de bord | {formData.first_name} {formData.last_name}</title>
        <meta name="description" content="Gérez vos concours, suivez vos points et consultez vos statistiques de participation." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <DashboardHeader firstName={profileData?.first_name} />
      
      {isLoading ? (
        <div className="space-y-8" role="status" aria-label="Chargement du tableau de bord">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          <StatsCards stats={stats} />
          <PointsOverview />
          <QuickActions />
          {profileData && (
            <ProfileCard 
              userProfile={profileData}
              isEditing={isEditing}
              formData={formData}
              setFormData={setFormData}
              setIsEditing={setIsEditing}
              userId={user.id}
              refetch={refetch}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;