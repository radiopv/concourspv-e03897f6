import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Medal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinnersList from "@/components/winners/WinnersList";
import { useToast } from "@/components/ui/use-toast";

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const { toast } = useToast();

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests-with-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (
            *,
            prize:prizes(
              catalog_item:prize_catalog(*)
            )
          )
        `)
        .eq('participants.status', 'winner')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les gagnants",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Chargement des gagnants...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous les gagnants</TabsTrigger>
          <TabsTrigger value="unclaimed">Prix à réclamer</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <WinnersList 
            contests={contests || []} 
            onClaimPrize={setSelectedWinner}
            showAll={true}
          />
        </TabsContent>

        <TabsContent value="unclaimed">
          <WinnersList 
            contests={contests || []} 
            onClaimPrize={setSelectedWinner}
            showAll={false}
          />
        </TabsContent>
      </Tabs>

      <WinnerClaimDialog
        winner={selectedWinner}
        open={!!selectedWinner}
        onClose={() => setSelectedWinner(null)}
      />
    </div>
  );
};

export default Winners;