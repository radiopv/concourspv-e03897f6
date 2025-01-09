import React from 'react';
import { supabase } from "@/lib/supabase";
import WinnersList from '../components/winners/WinnersList';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const Winners = () => {
  const { toast } = useToast();
  
  const { data: winners = [], isError, error } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      console.log('Fetching winners...');
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          contest:contests!fk_participants_contest (
            id,
            title
          ),
          participant_prizes (
            prize:prizes (
              id,
              catalog_item:prize_catalog (
                *
              )
            )
          )
        `)
        .eq('status', 'winner')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching winners:', error);
        throw error;
      }

      console.log('Winners data:', data);
      return data || [];
    }
  });

  if (isError && error instanceof Error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les gagnants: " + error.message,
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gagnants des concours</h1>
      <WinnersList winners={winners} />
    </div>
  );
};

export default Winners;