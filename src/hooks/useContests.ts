import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useContests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      console.log("Fetching contests...");
      
      // Récupérer les concours
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          participants (count),
          prizes (
            prize_catalog (
              name,
              image_url,
              value,
              shop_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        throw contestsError;
      }

      console.log("Fetched contests:", contests);
      return contests || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};