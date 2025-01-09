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
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  // Amélioration de la mise en cache avec staleTime et cacheTime
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user profile data...');
      await initializeUserData(user.id);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      console.log('Fetching user stats...');
      const { data, error } = await supabase
        .from('members')
        .select('total_points, contests_participated, contests_won')
        .eq('id', user.id)
        .single();
      
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
    enabled: !!user,
    retry: 1,
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
  });

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

  const isLoading = loading || isLoadingProfile || isLoadingStats;

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Tableau de bord | {formData.first_name} {formData.last_name}</title>
        <meta name="description" content="Gérez vos concours, suivez vos points et consultez vos statistiques de participation." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <DashboardHeader />
      
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
            userId={user.id}
            refetch={refetch}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
