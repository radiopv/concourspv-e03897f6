import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { WinnersList } from "@/components/winners/WinnersList";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<any>(null);

  const { data: winners, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          contest:contests(
            title,
            description
          ),
          prize:prizes(
            catalog_item:prize_catalog(*)
          )
        `)
        .eq('status', 'winner')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
      </div>

      <WinnersList 
        winners={winners || []} 
        onClaimPrize={setSelectedWinner} 
      />

      <WinnerClaimDialog
        winner={selectedWinner}
        open={!!selectedWinner}
        onClose={() => setSelectedWinner(null)}
      />
    </div>
  );
};

export default Winners;
