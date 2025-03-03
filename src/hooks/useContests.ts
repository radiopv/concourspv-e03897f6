
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { localData } from "@/lib/data";
import { Contest, ContestStatus } from "@/types/contest";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async (): Promise<Contest[]> => {
      console.log('Fetching active contests...');
      
      try {
        const contests = await localData.contests.getActive();
        
        console.log('Raw contests data:', contests);

        if (!contests || contests.length === 0) {
          console.log('No contests found in database');
          return [];
        }

        // Ensure the contests match the Contest type
        return contests.map(contest => ({
          ...contest,
          status: contest.status as ContestStatus
        }));
      } catch (error) {
        console.error('Error fetching contests:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les concours.",
        });
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false, // Changé de true à false pour éviter les refetch inutiles
    refetchInterval: 300000, // 5 minutes au lieu de 30 secondes
    staleTime: 120000, // 2 minutes au lieu de 15 secondes
    gcTime: 600000, // 10 minutes au lieu de 1 minute
  });
};
