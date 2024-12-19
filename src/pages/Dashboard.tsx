import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { Loader2, Trophy, Target, Star, Save } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Récupérer les statistiques de participation
      const { data: participationStats } = await supabase
        .from('participants')
        .select('score, status')
        .eq('id', user.id);

      // Calculer les statistiques
      const stats = participationStats?.reduce((acc, curr) => ({
        contests_participated: acc.contests_participated + 1,
        total_points: acc.total_points + (curr.score || 0),
        contests_won: acc.contests_won + (curr.status === 'winner' ? 1 : 0),
      }), {
        contests_participated: 0,
        total_points: 0,
        contests_won: 0,
      });

      // Récupérer ou créer le profil
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

      // Créer un nouveau profil avec les statistiques
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
        console.error("Erreur création profil:", createError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer votre profil. Veuillez réessayer.",
        });
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
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("members")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
      });
    }
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Bienvenue{userProfile?.first_name ? `, ${userProfile.first_name}` : ""} !
        </h1>
        <p className="text-gray-600 mt-2">
          Voici un aperçu de votre activité sur la plateforme
        </p>
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
            <p className="text-3xl font-bold">{Math.round(userProfile?.total_points || 0)}</p>
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Mon profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userProfile?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="flex justify-end gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier le profil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => navigate("/contests")}
        >
          <CardHeader>
            <CardTitle className="text-xl">Voir les concours</CardTitle>
            <CardDescription>Participez aux concours actifs</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;