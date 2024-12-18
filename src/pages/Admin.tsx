import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ParticipantsList from "@/components/admin/ParticipantsList";
import ContestPrizeManager from "@/components/admin/ContestPrizeManager";
import DrawManager from "@/components/admin/DrawManager";
import QuestionsManager from "@/components/admin/QuestionsManager";
import { useParams } from "react-router-dom";

const Admin = () => {
  const { contestId } = useParams();
  const { toast } = useToast();

  const { data: contest, isLoading, isError } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le concours.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
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
