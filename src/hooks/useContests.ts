
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
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes au lieu de 10
    staleTime: 15000, // Considérer les données comme périmées après 15 secondes au lieu de 5
    gcTime: 60000, // Conserver le cache pendant 1 minute au lieu de le désactiver
  });
};
