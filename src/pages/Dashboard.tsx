import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import { ExtendedProfileCard } from "@/components/profile/ExtendedProfileCard";
import QuickActions from "@/components/dashboard/QuickActions";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Récupérer le profil existant
      const { data: existingProfile, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Erreur lors de la récupération du profil:", fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        return existingProfile;
      }

      // Si le profil n'existe pas, créer un nouveau profil
      const { data: userData } = await supabase.auth.getUser();
      const newProfile = {
        id: user.id,
        email: userData.user?.email || "",
        first_name: userData.user?.user_metadata?.first_name || "",
        last_name: userData.user?.user_metadata?.last_name || "",
        role: user.email === "renaudcanuel@me.com" ? "admin" : "user",
        notifications_enabled: true,
        share_scores: true,
        total_points: 0,
        contests_participated: 0,
        contests_won: 0
      };

      const { data: createdProfile, error: createError } = await supabase
        .from("members")
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error("Erreur lors de la création du profil:", createError);
        toast({
          title: "Erreur",
          description: "Impossible de créer votre profil",
          variant: "destructive",
        });
        throw createError;
      }

      return createdProfile;
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return null;
  }

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <DashboardHeader firstName={userProfile?.first_name} />
      <StatsCards stats={userProfile} />
      <ExtendedProfileCard userProfile={userProfile} onUpdate={refetch} />
      <QuickActions />
    </div>
  );
};

export default Dashboard;