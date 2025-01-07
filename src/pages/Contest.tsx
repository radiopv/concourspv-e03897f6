import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Contest as ContestType } from "@/types/contest";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      if (!id) throw new Error('Contest ID is required');
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          questionnaires (
            id,
            title,
            description,
            questions (
              id,
              question_text,
              options,
              correct_answer
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching contest:', error);
        throw error;
      }
      return data as ContestType;
    },
    enabled: !!id
  });

  if (isLoading) {
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
            <p className="text-gray-600 mb-6">
              Le concours que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/contests')} variant="outline">
              Voir les concours disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuestionnaire) {
    return <QuestionnaireComponent contestId={id || ''} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {contest.title}
            </h1>
            {contest.description && (
              <p className="text-xl text-gray-600">
                {contest.description}
              </p>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg text-gray-600">
                    Date de fin : {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>

                <Button
                  onClick={() => setShowQuestionnaire(true)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
                >
                  Commencer le questionnaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contest;