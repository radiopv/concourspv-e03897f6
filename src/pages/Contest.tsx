import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useContest } from "@/hooks/useContests";

const Contest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading, error } = useContest(id);

  console.log("Contest data:", contest); // Debug log

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-600">Chargement du concours...</p>
        </div>
      </div>
    );
  }

  // Check if contest exists and is active
  const isContestAvailable = contest && 
    contest.status === 'active' && 
    new Date(contest.end_date) > new Date();

  if (error || !isContestAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Concours non disponible</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              {!contest ? "Ce concours n'existe pas." :
               contest.status !== 'active' ? "Ce concours n'est pas encore actif." :
               "Ce concours est terminé."}
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/contests')}
            >
              Voir les concours disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasQuestionnaire = contest.questions && contest.questions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">{contest.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contest.description && (
              <p className="text-gray-600">{contest.description}</p>
            )}
            
            {contest.prizes && contest.prizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Prix à gagner :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contest.prizes.map(prize => (
                    prize.catalog_item && (
                      <Card key={prize.id} className="p-4">
                        <div className="flex items-center gap-4">
                          {prize.catalog_item.image_url && (
                            <img 
                              src={prize.catalog_item.image_url} 
                              alt={prize.catalog_item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium">{prize.catalog_item.name}</h4>
                            {prize.catalog_item.value && (
                              <p className="text-sm text-gray-600">Valeur : {prize.catalog_item.value}€</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              </div>
            )}

            {hasQuestionnaire ? (
              <div className="space-y-4">
                {showQuestionnaire ? (
                  <QuestionnaireComponent contestId={contest.id} />
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                    onClick={() => setShowQuestionnaire(true)}
                  >
                    Participer maintenant
                  </Button>
                )}
              </div>
            ) : (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <p className="text-yellow-800">
                    Ce concours n'a pas encore de questions. Revenez plus tard.
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contest;