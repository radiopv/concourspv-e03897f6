import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminContestManager from "./AdminContestManager";
import ContestList from "./ContestList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shuffle, Database, Settings, Mail } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AdminDashboard = () => {
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Paramètres
                </CardTitle>
                <CardDescription>
                  Configuration globale
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/prizes">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Catalogue Prix
                </CardTitle>
                <CardDescription>
                  Gérer les prix
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/questions">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-500" />
                  Questions
                </CardTitle>
                <CardDescription>
                  Banque de questions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/emails">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-500" />
                  Emails
                </CardTitle>
                <CardDescription>
                  Gestion des emails
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Collapsible open={isNewContestOpen} onOpenChange={setIsNewContestOpen}>
          <CollapsibleTrigger asChild>
            <Button className="w-full mb-4">
              {isNewContestOpen ? 'Fermer' : 'Nouveau concours'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <AdminContestManager />
          </CollapsibleContent>
        </Collapsible>

        <ContestList 
          contests={contests || []} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;