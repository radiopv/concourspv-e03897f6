import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useContests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Veuillez vous connecter pour voir les concours.",
        });
        navigate('/login');
        throw new Error("Not authenticated");
      }

      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contests:', error);
        if (error.code === '401') {
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
          });
          navigate('/login');
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les concours. Veuillez réessayer.",
          });
        }
        throw error;
      }

      return contests || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000 // 5 minutes
  });
};