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
    email: "",
  });

  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log("Récupération du profil pour l'utilisateur:", user.id);

      // Récupère toutes les participations de l'utilisateur avec les détails des concours
      const { data: participationStats, error: participationError } = await supabase
        .from('participants')
        .select(`
          *,
          contests (
            id,
            title,
            status
          )
        `)
        .eq('id', user.id);

      if (participationError) {
        console.error("Erreur lors de la récupération des participations:", participationError);
        throw participationError;
      }

      console.log("Participations trouvées:", participationStats);
      
      // Log détaillé des statuts de participation
      if (participationStats) {
        participationStats.forEach(p => {
          console.log("Participation status:", p.status, "pour le concours:", p.contest_id);
        });
      }

      // Calcule les statistiques
      const stats = {
        contests_participated: participationStats?.length || 0,
        total_points: participationStats?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0,
        contests_won: participationStats?.filter(p => 
          p.status?.toUpperCase() === 'WINNER' || 
          p.status?.toUpperCase() === 'COMPLETED'
        ).length || 0,
      };

      console.log("Statistiques calculées:", stats);

      // Récupère le profil de l'utilisateur
      const { data: existingProfile, error: profileError } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur lors de la récupération du profil:", profileError);
        throw profileError;
      }

      if (existingProfile) {
        return {
          ...existingProfile,
          ...stats
        };
      }

      // Si le profil n'existe pas, crée un nouveau profil
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

      if (createError) {
        console.error("Erreur lors de la création du profil:", createError);
        throw createError;
      }

      return createdProfile;
    },
    retry: 1,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
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