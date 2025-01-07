import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { useToast } from "@/hooks/use-toast";

export const useContestQueries = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['admin-contests-with-counts'],
    queryFn: async () => {
      console.log('Fetching contests with counts...');
      
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          *,
          questionnaires (
            id,
            questions (count)
          ),
          participations (count)
        `)
        .order('created_at', { ascending: false });
      
      if (contestsError) {
        console.error('Error fetching contests:', contestsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les concours",
          variant: "destructive",
        });
        throw contestsError;
      }

      console.log('Fetched contests:', contests);

      return contests.map(contest => ({
        ...contest,
        questionsCount: contest.questionnaires?.[0]?.questions?.count || 0,
        participationsCount: contest.participations?.count || 0
      }));
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

export const useContest = (contestId: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      console.log('Fetching single contest:', contestId);
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          questionnaires (
            id,
            questions (
              id,
              question_text,
              options,
              correct_answer,
              article_url,
              order_number
            )
          ),
          prizes (
            id,
            catalog_item:prize_catalog (
              id,
              name,
              value,
              image_url
            )
          )
        `)
        .eq('id', contestId)
        .single();

      if (error) {
        console.error('Error fetching contest:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le concours",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched contest data:', data);
      return data;
    },
    enabled: !!contestId
  });
};