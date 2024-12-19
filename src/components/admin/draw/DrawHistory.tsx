import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DrawHistoryProps {
  contestId: string;
}

const DrawHistory = ({ contestId }: DrawHistoryProps) => {
  const { data: drawHistory, isLoading } = useQuery({
    queryKey: ['draw-history', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draw_history')
        .select(`
          *,
          participants (
            first_name,
            last_name
          )
        `)
        .eq('contest_id', contestId)
        .order('draw_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des résultats du tirage...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Tirages</CardTitle>
      </CardHeader>
      <CardContent>
        {drawHistory && drawHistory.length > 0 ? (
          <ul className="space-y-2">
            {drawHistory.map((draw) => (
              <li key={draw.id} className="flex justify-between">
                <span>
                  {draw.participants.first_name} {draw.participants.last_name}
                </span>
                <span>
                  {format(new Date(draw.draw_date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun tirage effectué pour ce concours.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DrawHistory;
