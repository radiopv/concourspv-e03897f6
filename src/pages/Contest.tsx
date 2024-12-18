import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Timer, CheckCircle } from "lucide-react";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

const Contest = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading: contestLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (*),
          participants (count)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['contest-stats', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', id)
        .gte('score', 70);
      
      if (error) throw error;
      return {
        successCount: data.length
      };
    },
    enabled: !!contest?.participants_count
  });

  useEffect(() => {
    if (!contest?.end_date) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(contest.end_date);
      
      if (now >= endDate) {
        setTimeLeft("Concours terminé");
        return;
      }

      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      const minutes = differenceInMinutes(endDate, now) % 60;

      setTimeLeft(`${days}j ${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [contest?.end_date]);

  if (contestLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              Concours non trouvé
            </h2>
            <p className="text-gray-600">
              Le concours que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuestionnaire) {
    return <QuestionnaireComponent contestId={id || ''} />;
  }

  const successPercentage = contest.participants_count > 0 && stats
    ? Math.round((stats.successCount / contest.participants_count) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* En-tête du concours */}
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {contest.title}
            </h1>
            <p className="text-xl text-gray-600">
              {contest.description}
            </p>
          </div>

          {/* Statistiques et informations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Users className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {contest.participants_count || 0}
                </p>
                <p className="text-sm text-gray-600">inscrits</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Taux de réussite</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {successPercentage}%
                </p>
                <p className="text-sm text-gray-600">≥ 70% de bonnes réponses</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Timer className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Temps restant</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {timeLeft}
                </p>
                <p className="text-sm text-gray-600">
                  Fin le {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prix à gagner */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
              <CardTitle>Prix à gagner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contest.prizes?.map((prize: any) => (
                  <div key={prize.id} className="text-center">
                    {prize.image_url && (
                      <img
                        src={prize.image_url}
                        alt={prize.name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="font-medium">{prize.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bouton de participation */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setShowQuestionnaire(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto animate-pulse"
            >
              Participer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;