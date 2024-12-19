import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import WinnersByContest from "@/components/winners/WinnersByContest";
import { Trophy } from "lucide-react";

const Winners = () => {
  const { data: contests } = useQuery({
    queryKey: ['contests-with-winners'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      const query = supabase
        .from('contests')
        .select('id, title')
        .order('created_at', { ascending: false });

      // Si l'utilisateur est connecté, montrer tous les concours
      if (!session.session) {
        query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
      </div>

      <div className="space-y-6">
        {contests?.map((contest) => (
          <WinnersByContest key={contest.id} contestId={contest.id} />
        ))}
      </div>
    </div>
  );
};

export default Winners;
