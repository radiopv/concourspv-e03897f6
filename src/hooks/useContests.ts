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
          questionnaires (
            id,
            title,
            description,
            questions (
              id,
              question_text,
              options,
              correct_answer,
              article_url,
              order_number
            )
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
          questionnaires (
            id,
            title,
            description,
            questions (
              id,
              question_text,
              options,
              correct_answer,
              article_url,
              order_number
            )
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

      return data as Contest;
    },
    enabled: !!contestId,
  });
};