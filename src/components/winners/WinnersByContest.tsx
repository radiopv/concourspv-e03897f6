import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, Gift } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WinnersByContestProps {
  contestId: string;
}

const WinnersByContest = ({ contestId }: WinnersByContestProps) => {
  const { toast } = useToast();

  const { data: contestData } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            catalog_item:prize_catalog(*)
          )
        `)
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: winners } = useQuery({
    queryKey: ['contest-winners', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'winner');
      
      if (error) throw error;
      return data;
    }
  });

  if (!contestData || !winners) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          {contestData.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {winners.map((winner) => (
            <div key={winner.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{winner.first_name} {winner.last_name}</p>
                  <p className="text-sm text-gray-600">{winner.email}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(winner.updated_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                {contestData.prizes?.[0]?.catalog_item && (
                  <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg">
                    <Gift className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {contestData.prizes[0].catalog_item.name}
                    </span>
                  </div>
                )}
              </div>
              {!winner.prize_claimed && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    toast({
                      title: "Réclamation du prix",
                      description: "Fonctionnalité en cours de développement",
                    });
                  }}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Réclamer le prix
                </Button>
              )}
            </div>
          ))}
          {winners.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun gagnant pour ce concours
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinnersByContest;
