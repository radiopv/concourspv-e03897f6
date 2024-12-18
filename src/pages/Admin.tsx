import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import QuestionsManager from "../components/admin/QuestionsManager";
import ParticipantsList from "../components/admin/ParticipantsList";
import DrawManager from "../components/admin/DrawManager";
import AdminAuth from "../components/admin/AdminAuth";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (count)
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
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
    <div className="max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests?.map((contest) => (
            <Card 
              key={contest.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedContest(contest.id)}
            >
              <CardHeader>
                <CardTitle>{contest.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {contest._count?.participants || 0} participants
                </p>
                <p className="text-sm text-gray-500">
                  Statut: {contest.status}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Nouveau concours</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Créer un concours</Button>
            </CardContent>
          </Card>
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
              <TabsTrigger value="draw">Tirage au sort</TabsTrigger>
            </TabsList>

            <TabsContent value="questions">
              <QuestionsManager contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="participants">
              <ParticipantsList contestId={selectedContest} />
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