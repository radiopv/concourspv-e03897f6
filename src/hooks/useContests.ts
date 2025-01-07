import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { Contest } from "../types/contest";

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      console.log('Début de la récupération des concours...');
      
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
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des concours:', error);
        throw error;
      }

      console.log('Concours récupérés:', data);
      return data as Contest[];
    },
  });
};