import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminContestManager from "./AdminContestManager";
import ContestList from "./ContestList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shuffle, Database } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ContestAIAssistant } from "./ContestAIAssistant";

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
    },
    enabled: true
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Sélectionner le premier concours actif par défaut si aucun n'est sélectionné
  const activeContest = contests?.find(contest => contest.status === 'active');
  const contestToUse = selectedContest || (activeContest?.id || '');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <Link 
                to={`/admin/contests/${contestToUse}/participants`}
                className={!contestToUse ? 'pointer-events-none' : ''}
              >
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled={!contestToUse}
                >
                  Voir les participants
                </Button>
              </Link>
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
              <Link 
                to={`/admin/contests/${contestToUse}/draw`}
                className={!contestToUse ? 'pointer-events-none' : ''}
              >
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled={!contestToUse}
                >
                  Gérer les tirages
                </Button>
              </Link>
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
              <Link 
                to={`/admin/contests/${contestToUse}/winners`}
                className={!contestToUse ? 'pointer-events-none' : ''}
              >
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled={!contestToUse}
                >
                  Voir les gagnants
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-500" />
                Banque de Questions
              </CardTitle>
              <CardDescription>
                Gérez votre banque de questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/questions">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Collapsible open={isNewContestOpen} onOpenChange={setIsNewContestOpen}>
            <div className="flex items-center justify-between mb-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  Créer un nouveau concours
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <AdminContestManager />
            </CollapsibleContent>
          </Collapsible>

          <ContestAIAssistant />
        </div>

        <ContestList 
          contests={contests || []} 
          onSelectContest={setSelectedContest} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;