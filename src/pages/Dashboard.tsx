import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { Loader2, Trophy, Target, Star, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  total_points: number;
  contests_participated: number;
  contests_won: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: existingProfile, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        return existingProfile as UserProfile;
      }

      const { data: userData } = await supabase.auth.getUser();
      const newProfile = {
        id: user.id,
        email: userData.user?.email || "",
        first_name: userData.user?.user_metadata?.first_name || "",
        last_name: userData.user?.user_metadata?.last_name || "",
        total_points: 0,
        contests_participated: 0,
        contests_won: 0,
        notifications_enabled: true,
        share_scores: true,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from("members")
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error("Erreur création profil:", createError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer votre profil. Veuillez réessayer.",
        });
        throw createError;
      }

      return createdProfile as UserProfile;
    },
    retry: 1,
  });

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
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.email === "renaudcanuel@me.com";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Bienvenue{userProfile?.first_name ? `, ${userProfile.first_name}` : ""} !
          </h1>
          <p className="text-gray-600 mt-2">
            Voici un aperçu de votre activité sur la plateforme
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Administration
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              Participations
            </CardTitle>
            <CardDescription>Total des concours participés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userProfile?.contests_participated || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Points
            </CardTitle>
            <CardDescription>Points accumulés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userProfile?.total_points || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-green-500" />
              Victoires
            </CardTitle>
            <CardDescription>Concours gagnés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userProfile?.contests_won || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => navigate("/contests")}>
          <CardHeader>
            <CardTitle className="text-xl">Voir les concours</CardTitle>
            <CardDescription>Participez aux concours actifs</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/profile")}>
          <CardHeader>
            <CardTitle className="text-xl">Mon profil</CardTitle>
            <CardDescription>Gérez vos informations personnelles</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;