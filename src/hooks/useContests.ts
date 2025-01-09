import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import type { Contest } from "../types/contest";

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            id,
            catalog_item:prize_catalog (
              name,
              value,
              image_url,
              description,
              shop_url
            )
          ),
          questions:questionnaires (
            id,
            title,
            description,
            questions (*)
          )
        `)
        .eq('status', 'active')
        .gte('end_date', now)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      console.log('Fetched contests:', data);
      return data as unknown as Contest[];
    },
  });
};

export const useContest = (contestId: string | undefined) => {
  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) {
        console.error('No contest ID provided');
        throw new Error('Contest ID is required');
      }
      
      console.log('Fetching contest with ID:', contestId);
      const now = new Date().toISOString();

      // Première requête pour vérifier si le concours existe
      const { data: contestExists, error: existsError } = await supabase
        .from('contests')
        .select('id')
        .eq('id', contestId)
        .single();

      if (existsError || !contestExists) {
        console.error('Contest does not exist:', contestId);
        throw new Error('Contest not found');
      }

      // Si le concours existe, récupérer toutes ses données
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            id,
            catalog_item:prize_catalog (
              name,
              value,
              image_url,
              description,
              shop_url
            )
          ),
          questions:questionnaires (
            id,
            title,
            description,
            questions (*)
          )
        `)
        .eq('id', contestId)
        .eq('status', 'active')
        .gte('end_date', now)
        .single();

      if (error) {
        console.error('Error fetching contest:', error);
        throw error;
      }

      if (!data) {
        console.error('No contest found with ID:', contestId);
        throw new Error('Contest not found');
      }

      console.log('Fetched contest data:', data);
      return data as unknown as Contest;
    },
    enabled: !!contestId,
  });
};