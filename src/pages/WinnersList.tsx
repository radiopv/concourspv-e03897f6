import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const WinnersList = () => {
  const { data: winners, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          contests (
            title
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
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des Gagnants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {winners?.map((winner) => (
          <div key={winner.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {winner.first_name} {winner.last_name}
            </h2>
            <p className="text-gray-600 mb-4">
              Concours : {winner.contests?.title}
            </p>
            {winner.participant_prizes?.[0]?.prize?.catalog_item && (
              <div className="mt-2">
                <p className="font-medium">Prix gagné :</p>
                <p>{winner.participant_prizes[0].prize.catalog_item.name}</p>
                <p className="text-sm text-gray-500">
                  Valeur : {winner.participant_prizes[0].prize.catalog_item.value}€
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnersList;