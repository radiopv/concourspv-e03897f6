import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminContestManager from "./AdminContestManager";
import ContestList from "./ContestList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shuffle, Database, Gift, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AdminDashboard = () => {
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [isNewContestOpen, setIsNewContestOpen] = useState(false);
  const { toast } = useToast();

  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                Création
              </CardTitle>
              <CardDescription>
                Créer un nouveau concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setIsNewContestOpen(!isNewContestOpen)}
              >
                Nouveau concours
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Participants
              </CardTitle>
              <CardDescription>
                Gérez les participants aux concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setSelectedContest(contests?.[0]?.id)}
              >
                Voir les participants
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-purple-500" />
                Tirages
              </CardTitle>
              <CardDescription>
                Effectuez les tirages au sort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setSelectedContest(contests?.[0]?.id)}
              >
                Gérer les tirages
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Gagnants
              </CardTitle>
              <CardDescription>
                Consultez les gagnants des concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setSelectedContest(contests?.[0]?.id)}
              >
                Voir les gagnants
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-500" />
                Cadeaux
              </CardTitle>
              <CardDescription>
                Gérez le catalogue des prix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/prize-catalog" className="w-full block">
                <Button 
                  className="w-full"
                  variant="outline"
                >
                  Gérer les cadeaux
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-500" />
                Questions
              </CardTitle>
              <CardDescription>
                Gérez votre banque de questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/question-bank" className="w-full block">
                <Button 
                  className="w-full"
                  variant="outline"
                >
                  Accéder à la banque
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Collapsible open={isNewContestOpen} onOpenChange={setIsNewContestOpen}>
          <CollapsibleContent className="space-y-2">
            <AdminContestManager />
          </CollapsibleContent>
        </Collapsible>

        <ContestList 
          contests={contests || []} 
          onSelectContest={setSelectedContest} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;