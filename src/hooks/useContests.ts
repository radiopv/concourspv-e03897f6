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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return [];
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
        if (error.status === 401) {
          navigate('/login');
          return [];
        }
        throw error;
      }

      return contests || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 300000, // 5 minutes
    staleTime: 300000, // 5 minutes
  });
};