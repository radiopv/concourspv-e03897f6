import React from 'react';
import { supabase } from "@/lib/supabase";
import WinnersList from '../components/winners/WinnersList';
import { useQuery } from '@tanstack/react-query';

const Winners = () => {
  const { data: contests = [] } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('has_winners', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleClaimPrize = async () => {
    // Implement prize claiming logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gagnants des concours</h1>
      <WinnersList 
        contests={contests} 
        onClaimPrize={handleClaimPrize}
        showAll={true}
      />
    </div>
  );
};

export default Winners;