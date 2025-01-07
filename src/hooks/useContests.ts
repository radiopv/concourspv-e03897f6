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
            description
          )
        `)
        .eq('status', 'active')
        .gte('end_date', now)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      return data as Contest[];
    },
  });
};

export const useContest = (contestId: string | undefined) => {
  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
      console.log('Fetching contest with ID:', contestId);

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
            description
          )
        `)
        .eq('id', contestId)
        .single();

      if (error) {
        console.error('Error fetching contest:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Contest not found');
      }

      console.log('Fetched contest data:', data);
      return data as Contest;
    },
    enabled: !!contestId,
  });
};