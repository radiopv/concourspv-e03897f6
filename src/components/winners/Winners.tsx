import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Winners = () => {
  const { data: winners, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*, contests(title)')
        .eq('status', 'winner')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {winners?.map((winner) => (
        <Card key={winner.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {winner.first_name} {winner.last_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Concours: {winner.contests?.title}</p>
            <p className="text-sm text-gray-600">
              Date: {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Winners;