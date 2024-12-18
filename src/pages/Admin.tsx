import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import QuestionsManager from "../components/admin/QuestionsManager";
import ParticipantsList from "../components/admin/ParticipantsList";
import DrawManager from "../components/admin/DrawManager";
import ContestPrizeManager from "../components/admin/ContestPrizeManager";
import AdminAuth from "../components/admin/AdminAuth";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as XLSX from 'xlsx';

const Admin = () => {
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newContest, setNewContest] = useState({
    title: "",
    description: "",
    end_date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "renaudcanuel@me.com") {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const { data: contests, isLoading, refetch } = useQuery({
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
          participants (count)
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const handleCreateContest = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un concours",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('contests')
        .insert([{
          title: newContest.title,
          description: newContest.description,
          end_date: newContest.end_date,
          status: 'active'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le concours a été créé avec succès",
      });

      setNewContest({
        title: "",
        description: "",
        end_date: "",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du concours",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Assuming the CSV/Excel has columns: title, description, end_date
        const contestData = jsonData.map((row: any) => ({
          title: row.title,
          description: row.description,
          end_date: row.end_date,
          status: 'active'
        }));

        const { error } = await supabase
          .from('contests')
          .insert(contestData);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Les concours ont été importés avec succès",
        });

        refetch();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'importation des concours",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Créer un nouveau concours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newContest.title}
                  onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newContest.description}
                  onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newContest.end_date}
                  onChange={(e) => setNewContest({ ...newContest, end_date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateContest} className="w-full">
                Créer le concours
              </Button>
              <div className="mt-4">
                <Label htmlFor="file-upload">Importer des concours (CSV/Excel)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

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
                    {contest.participants_count || 0} participants
                  </p>
                  <p className="text-sm text-gray-500">
                    Statut: {contest.status}
                  </p>
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