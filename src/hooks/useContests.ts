import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useContests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Veuillez vous connecter pour voir les concours.",
        });
        navigate('/login');
        return [];
      }

      console.log('Fetching contests...');
      
      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants(count),
          questions(count),
          prizes(
            id,
            prize_catalog_id,
            prize_catalog(
              name,
              description,
              image_url,
              shop_url,
              value
            )
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      console.log('Raw contests data:', contests);

      if (!contests || contests.length === 0) {
        console.log('No contests found in database');
        return [];
      }

      const processedContests = contests.map(contest => ({
        ...contest,
        participants: { count: contest.participants?.[0]?.count || 0 },
        questions: { count: contest.questions?.[0]?.count || 0 },
        prizes: contest.prizes?.map(prize => ({
          id: prize.id,
          name: prize.prize_catalog.name,
          description: prize.prize_catalog.description,
          image_url: prize.prize_catalog.image_url,
          shop_url: prize.prize_catalog.shop_url,
          value: prize.prize_catalog.value
        })) || []
      }));

      console.log('Processed contests:', processedContests);
      return processedContests;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};