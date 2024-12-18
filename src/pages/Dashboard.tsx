import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { Loader2 } from "lucide-react";

interface UserStats {
  totalParticipations: number;
  totalPoints: number;
  contestsWon: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  const { data: userStats, isLoading } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("members")
        .select("total_points, contests_participated, contests_won")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as UserStats;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Participations</CardTitle>
            <CardDescription>Nombre total de participations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userStats?.totalParticipations || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Points</CardTitle>
            <CardDescription>Total des points gagnés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userStats?.totalPoints || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Victoires</CardTitle>
            <CardDescription>Nombre de concours gagnés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userStats?.contestsWon || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate("/contests")}>
            <CardHeader>
              <CardTitle>Voir les concours</CardTitle>
              <CardDescription>Participez aux concours actifs</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate("/profile")}>
            <CardHeader>
              <CardTitle>Mon profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;