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
          questionnaires (
            count
          ),
          responses (
            count
          )
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
                <Award className="w-5 h-5 text-amber-500" />
                Concours
              </CardTitle>
              <CardDescription>
                Gérez les concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setIsNewContestOpen(!isNewContestOpen)}
              >
                {isNewContestOpen ? 'Fermer' : 'Nouveau concours'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-500" />
                Questions
              </CardTitle>
              <CardDescription>
                Gérez la banque de questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/questions">
                <Button 
                  className="w-full"
                  variant="outline"
                >
                  Banque de questions
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