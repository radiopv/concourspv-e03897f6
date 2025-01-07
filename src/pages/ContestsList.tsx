import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Star, Calendar, Loader } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useContests } from "@/hooks/useContests";
import { useToast } from "@/hooks/use-toast";

const ContestsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: contests, isLoading, error } = useContests();

  const handleParticipateClick = (contestId: string) => {
    if (contestId) {
      navigate(`/contest/${contestId}`);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à ce concours pour le moment.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-600">Chargement des concours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-4">
          Impossible de charger les concours. Veuillez réessayer plus tard.
        </p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Aucun concours disponible
        </h2>
        <p className="text-gray-600">
          Il n'y a pas de concours actifs pour le moment. Revenez plus tard !
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold mb-2 text-indigo-900">Concours Disponibles</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez à nos concours passionnants et tentez de gagner des prix exceptionnels. 
            Testez vos connaissances et augmentez vos chances de remporter de superbes récompenses !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card 
              key={contest.id} 
              className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-indigo-100"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-indigo-900">
                    {contest.title}
                  </CardTitle>
                  {contest.is_new && (
                    <Badge className="bg-blue-500">Nouveau</Badge>
                  )}
                </div>
                {contest.description && (
                  <p className="text-gray-600">{contest.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {contest.prizes && contest.prizes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-purple-700">
                      <Trophy className="w-5 h-5" />
                      Prix à gagner
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {contest.prizes.map((prize, index) => (
                        prize.catalog_item && (
                          <div 
                            key={index} 
                            className="relative group overflow-hidden rounded-lg border border-purple-100 bg-white"
                          >
                            {prize.catalog_item.image_url && (
                              <div className="aspect-square relative">
                                <img
                                  src={prize.catalog_item.image_url}
                                  alt={prize.catalog_item.name}
                                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="font-medium text-purple-700">
                                {prize.catalog_item.name}
                              </p>
                              {prize.catalog_item.value && (
                                <p className="text-sm text-purple-600">
                                  Valeur: {prize.catalog_item.value}€
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>
                      Jusqu'au {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  {contest.has_big_prizes && (
                    <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-700">
                      <Star className="w-4 h-4" />
                      Gros lots
                    </Badge>
                  )}
                </div>

                <Button 
                  onClick={() => handleParticipateClick(contest.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group"
                >
                  <Gift className="w-4 h-4 mr-2 transform group-hover:scale-110 transition-transform" />
                  Participer maintenant
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