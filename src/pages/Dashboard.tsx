import React from 'react';
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
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id || !user?.email) return null;
      
      const { data: member, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!member) {
        const defaultData = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || 'New',
          last_name: user.user_metadata?.last_name || 'Member',
          total_points: 0,
          contests_participated: 0,
          contests_won: 0,
          notifications_enabled: true,
          share_scores: true,
        };

        const { data: newMember, error: createError } = await supabase
          .from('members')
          .insert([defaultData])
          .select()
          .single();

        if (createError) throw createError;
        return newMember;
      }

      await initializeUserPoints(user.id);
      return member;
    },
    enabled: !!user?.id && !!user?.email,
  });

  if (!user) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-100">
        <Helmet>
          <title>Connexion requise | Tableau de bord</title>
        </Helmet>
        <h1 className="text-2xl font-bold text-amber-800">
          Veuillez vous connecter pour accéder à votre tableau de bord
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Helmet>
        <title>Tableau de bord | {profileData?.first_name} {profileData?.last_name}</title>
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader firstName={profileData?.first_name} />
      </motion.div>

      {isLoadingProfile ? (
        <div className="space-y-8" role="status" aria-label="Chargement du tableau de bord">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsCards stats={profileData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6 rounded-xl"
          >
            <PointsOverview />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card p-6 rounded-xl"
          >
            <QuickActions />
          </motion.div>

          {profileData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-card p-6 rounded-xl"
            >
              <ProfileCard 
                userProfile={profileData}
                userId={user.id}
                refetch={refetch}
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;