import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import WinnersList from "./WinnersList";
import WinnerClaimDialog from "./WinnerClaimDialog";
import { useState } from "react";

const Winners = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: winners, isLoading } = useQuery({
    queryKey: ['featured-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_winners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nos Gagnants</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Ajouter un gagnant
        </button>
      </div>
      <WinnersList winners={winners || []} />
      <WinnerClaimDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Winners;