import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import WinnersListComponent from "@/components/winners/WinnersList";
import { useToast } from "@/hooks/use-toast";

const WinnersList = () => {
  const { toast } = useToast();

  const { data: contests, isLoading } = useQuery({
    queryKey: ['winners-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (
            id,
            first_name,
            last_name,
            status,
            prize_claimed,
            prize_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleClaimPrize = async (winner: any) => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ prize_claimed: true })
        .eq('id', winner.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Prix réclamé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réclamer le prix",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Liste des Gagnants</h1>
      <WinnersListComponent
        contests={contests || []}
        onClaimPrize={handleClaimPrize}
        showAll={false}
      />
    </div>
  );
};

export default WinnersList;