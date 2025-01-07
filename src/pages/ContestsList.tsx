import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../App";
import { Contest } from "@/types/contest";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ContestsList = () => {
  const navigate = useNavigate();

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contest[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Concours Disponibles</h1>
          <p className="text-gray-600">
            Participez à nos concours et tentez de gagner des prix exceptionnels !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests?.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{contest.title}</h2>
                {contest.description && (
                  <p className="text-gray-600 mb-4">{contest.description}</p>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Jusqu'au {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/contest/${contest.id}`)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Participer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;