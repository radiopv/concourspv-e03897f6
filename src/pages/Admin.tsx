import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ParticipantsList from "@/components/admin/ParticipantsList";
import ContestPrizeManager from "@/components/admin/ContestPrizeManager";
import DrawManager from "@/components/admin/DrawManager";
import QuestionsManager from "@/components/admin/QuestionsManager";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: contest, isLoading, isError, error } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) {
        throw new Error("Contest ID is required");
      }

      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Contest not found");
      
      return data;
    },
    enabled: !!contestId
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger le concours.",
        variant: "destructive",
      });
      navigate('/admin/contests');
    }
  }, [isError, error, toast, navigate]);

  if (!contestId) {
    return (
      <div className="p-4">
        <Card>
          <CardContent>
            <p className="text-center text-red-500">ID du concours manquant</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="p-4">
        <Card>
          <CardContent>
            <p className="text-center text-red-500">Concours non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{contest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{contest.description}</p>
        </CardContent>
      </Card>

      <ParticipantsList contestId={contestId} />
      <ContestPrizeManager contestId={contestId} />
      <DrawManager contestId={contestId} />
      <QuestionsManager contestId={contestId} />
    </div>
  );
};

export default Admin;