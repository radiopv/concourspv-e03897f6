import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Plus } from "lucide-react";
import QuestionsManager from "../components/admin/QuestionsManager";
import ContestParticipants from "../components/admin/contest-card/ContestParticipants";
import DrawManager from "../components/admin/DrawManager";
import ContestPrizeManager from "../components/admin/ContestPrizeManager";
import AdminAuth from "../components/admin/AdminAuth";
import AdminContestManager from "../components/admin/AdminContestManager";
import ContestList from "../components/admin/ContestList";
import ContentValidator from "../components/admin/ContentValidator";
import PrizeCatalogManager from "../components/admin/PrizeCatalogManager";
import { useToast } from "@/components/ui/use-toast";
import ContestDraw from "../components/admin/contest-card/ContestDraw";

const Admin = () => {
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewContestOpen, setIsNewContestOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
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
    enabled: isAuthenticated,
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
          <Collapsible open={isNewContestOpen} onOpenChange={setIsNewContestOpen}>
            <div className="flex items-center justify-between mb-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer un nouveau concours
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <AdminContestManager />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={isValidatorOpen} onOpenChange={setIsValidatorOpen}>
            <div className="flex items-center justify-between mb-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  Validation du contenu
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <ContentValidator />
            </CollapsibleContent>
          </Collapsible>

          <PrizeCatalogManager />
          
          <ContestList 
            contests={contests || []} 
            onSelectContest={setSelectedContest} 
          />
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
              <ContestParticipants contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="prizes">
              <ContestPrizeManager contestId={selectedContest} />
            </TabsContent>

            <TabsContent value="draw">
              <ContestDraw 
                contestId={selectedContest} 
                drawDate={contests?.find(c => c.id === selectedContest)?.draw_date || ''} 
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Admin;
