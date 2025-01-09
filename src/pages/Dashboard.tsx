import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

  const { data: statsData } = useQuery({
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
        totalPoints: data.total_points || 0,
        contestsParticipated: data.contests_participated || 0,
        contestsWon: data.contests_won || 0,
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
      <StatsCards stats={statsData || { totalPoints: 0, contestsParticipated: 0, contestsWon: 0 }} />
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