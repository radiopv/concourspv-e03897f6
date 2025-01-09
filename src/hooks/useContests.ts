import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
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
      return data as Contest[];
    },
  });
};

export const useContest = (contestId: string | undefined) => {
  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) {
        throw new Error('Contest ID is required');
      }

      console.log('Fetching contest with ID:', contestId);

      // Requête simple et directe
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();

      if (error) {
        console.error('Error fetching contest:', error);
        throw error;
      }

      console.log('Fetched contest data:', data);

      if (!data) {
        throw new Error('Contest not found');
      }

      // Si on a trouvé le concours, on fait une deuxième requête pour obtenir toutes les relations
      const { data: fullData, error: fullError } = await supabase
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
        .single();

      if (fullError) {
        console.error('Error fetching full contest data:', fullError);
        throw fullError;
      }

      console.log('Fetched full contest data:', fullData);
      return fullData as Contest;
    },
    enabled: !!contestId,
  });
};