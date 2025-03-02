
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { localData } from "@/lib/localData";
import { Contest, ContestStatus } from "@/types/contest";

export const useContests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async (): Promise<Contest[]> => {
      console.log('Fetching contests...');
      
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
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
    staleTime: 5000, // Considérer les données comme périmées après 5 secondes
    gcTime: 0, // Désactiver le cache
  });
};
