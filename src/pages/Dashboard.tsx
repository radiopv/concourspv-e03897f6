import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ProfileCard from "@/components/dashboard/ProfileCard";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: participationStats } = await supabase
        .from('participants')
        .select('score, status')
        .eq('id', user.id);

      const stats = participationStats?.reduce((acc, curr) => ({
        contests_participated: acc.contests_participated + 1,
        total_points: acc.total_points + (curr.score || 0),
        contests_won: acc.contests_won + (curr.status === 'winner' ? 1 : 0),
      }), {
        contests_participated: 0,
        total_points: 0,
        contests_won: 0,
      });

      const { data: existingProfile } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        return {
          ...existingProfile,
          ...stats
        };
      }

      const { data: userData } = await supabase.auth.getUser();
      const newProfile = {
        id: user.id,
        email: userData.user?.email || "",
        first_name: userData.user?.user_metadata?.first_name || "",
        last_name: userData.user?.user_metadata?.last_name || "",
        ...stats,
        notifications_enabled: true,
        share_scores: true,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from("members")
        .insert([newProfile])
        .select()
        .single();

      if (createError) throw createError;

      return createdProfile;
    },
    retry: 1,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
      });
    }
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Une erreur est survenue</h1>
          <p className="text-gray-600 mt-2">Impossible de charger votre profil</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader firstName={userProfile?.first_name} />
      
      <StatsCards stats={userProfile} />

      <ProfileCard
        userProfile={userProfile}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        setIsEditing={setIsEditing}
        userId={user?.id}
        refetch={refetch}
      />

      <QuickActions />
    </div>
  );
};

export default Dashboard;