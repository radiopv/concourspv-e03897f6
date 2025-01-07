import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../App";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Contest as ContestType } from "@/types/contest";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading, error } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      console.log('Fetching contest with ID:', id);
      if (!id) throw new Error('Contest ID is required');
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          prizes (
            id,
            catalog_item:prize_catalog (
              name,
              value,
              image_url,
              description,
              shop_url
            )
          ),
          questionnaires (
            id,
            title,
            description,
            questions (
              id,
              question_text,
              options,
              correct_answer,
              article_url,
              order_number
            )
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error fetching contest:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Contest not found');
      }

      console.log('Contest data:', data);
      return data as ContestType;
    },
    meta: {
      errorMessage: "Le concours n'a pas pu être chargé. Veuillez réessayer plus tard."
    }
  });

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

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Concours non trouvé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Le concours que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/contests')}
            >
              Retour aux concours
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">{contest.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{contest.description}</p>
            <div className="mt-4">
              {contest.prizes && contest.prizes.length > 0 && (
                <div>
                  <h3 className="font-semibold">Prix à gagner:</h3>
                  <ul>
                    {contest.prizes.map(prize => (
                      <li key={prize.id}>{prize.catalog_item?.name} - {prize.catalog_item?.value}€</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-4">
              {contest.questionnaires && contest.questionnaires.length > 0 && (
                <div>
                  <h3 className="font-semibold">Questionnaires:</h3>
                  {contest.questionnaires.map(questionnaire => (
                    <div key={questionnaire.id}>
                      <h4 className="font-medium">{questionnaire.title}</h4>
                      {showQuestionnaire && (
                        <QuestionnaireComponent contestId={contest.id} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              className="mt-4" 
              onClick={() => setShowQuestionnaire(true)}
            >
              Participer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contest;