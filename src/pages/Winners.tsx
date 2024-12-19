import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Gagnants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners?.map((winner) => (
          <Card key={winner.id}>
            <CardHeader>
              <CardTitle>{winner.first_name} {winner.last_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Concours: {winner.contests.title}</p>
              <p>Date: {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Winners;
