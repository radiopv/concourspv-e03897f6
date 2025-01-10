import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import WinnerDisplay from "@/components/winners/WinnerDisplay";

const AdminWinnersList = () => {
  const { data: winners, isLoading } = useQuery({
    queryKey: ['admin-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          contests (
            title,
            id
          ),
          participant_prizes (
            prize:prizes (
              catalog_item:prize_catalog(*)
            )
          )
        `)
        .eq('status', 'winner')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!winners?.length) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <Trophy className="w-16 h-16 text-amber-500 opacity-50" />
          <h3 className="text-xl font-semibold text-amber-900">
            Aucun gagnant pour le moment
          </h3>
          <p className="text-amber-700">
            Les gagnants des concours apparaîtront ici une fois les tirages effectués.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h2 className="text-2xl font-bold text-amber-900">
          Tableau des Gagnants
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {winners.map((winner) => (
          <WinnerDisplay
            key={winner.id}
            winner={winner}
            contestTitle={winner.contests?.title || 'Concours'}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminWinnersList;