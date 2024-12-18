import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import QuestionsManager from "../components/admin/QuestionsManager";
import ParticipantsList from "../components/admin/ParticipantsList";
import DrawManager from "../components/admin/DrawManager";
import ContestPrizeManager from "../components/admin/ContestPrizeManager";
import AdminAuth from "../components/admin/AdminAuth";
import AdminContestManager from "../components/admin/AdminContestManager";
import { useToast } from "@/components/ui/use-toast";
import { Archive, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "renaudcanuel@me.com") {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

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
          participants (count),
          questions (count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const archiveContestMutation = useMutation({
    mutationFn: async (contestId: string) => {
      const { error } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', contestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toast({
        title: "Succès",
        description: "Le concours a été archivé",
      });
    },
  });

  const deleteContestMutation = useMutation({
    mutationFn: async (contestId: string) => {
      const { error } = await supabase
        .from('contests')
        .delete()
        .eq('id', contestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toast({
        title: "Succès",
        description: "Le concours a été supprimé",
      });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté",
    });
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">Administration</h1>
          <p className="text-gray-600">Gérez vos concours</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>

      {!selectedContest ? (
        <div className="space-y-8">
          <AdminContestManager />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests?.map((contest) => (
              <Card 
                key={contest.id}
                className={`hover:shadow-lg transition-shadow ${contest.status === 'archived' ? 'opacity-60' : ''}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold cursor-pointer" onClick={() => setSelectedContest(contest.id)}>
                    {contest.title}
                  </CardTitle>
                  <div className="flex space-x-2">
                    {contest.status !== 'archived' && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => archiveContestMutation.mutate(contest.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Toutes les questions et participations seront supprimées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => deleteContestMutation.mutate(contest.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      {contest.participants_count || 0} participants
                    </p>
                    <p className="text-sm text-gray-500">
                      {contest.questions_count || 0} questions
                    </p>
                    <p className="text-sm text-gray-500">
                      Statut: {contest.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedContest(null)}
          >
            Retour à la liste
          </Button>

          <Tabs defaultValue="questions">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="prizes">Prix</TabsTrigger>
              <TabsTrigger value="draw">Tirage au sort</TabsTrigger>
            </TabsList>

            <TabsContent value="questions">
              <QuestionsManager contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="participants">
              <ParticipantsList contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="prizes">
              <ContestPrizeManager contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="draw">
              <DrawManager contestId={selectedContest} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Admin;