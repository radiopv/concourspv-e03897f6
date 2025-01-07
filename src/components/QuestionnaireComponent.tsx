import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: questions } = useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('questionnaire_id', contestId)
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("Not authenticated");
      }

      // Get or create participant
      const { data: participant } = await supabase
        .from('participants')
        .select('id')
        .eq('email', session.session.user.email)
        .single();

      if (!participant) {
        const { data: newParticipant, error: participantError } = await supabase
          .from('participants')
          .insert({
            email: session.session.user.email,
            first_name: session.session.user.user_metadata.first_name || '',
            last_name: session.session.user.user_metadata.last_name || ''
          })
          .select('id')
          .single();

        if (participantError) throw participantError;
      }

      const currentQuestion = questions?.[currentQuestionIndex];
      if (!currentQuestion) return;

      // Save the answer
      const { error: responseError } = await supabase
        .from('responses')
        .insert({
          participant_id: participant?.id,
          question_id: currentQuestion.id,
          contest_id: contestId,
          answer_text: selectedAnswer
        });

      if (responseError) throw responseError;

      // Move to next question or finish
      if (currentQuestionIndex < (questions?.length || 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer("");
      } else {
        navigate(`/contest/${contestId}/stats`);
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse",
        variant: "destructive",
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg text-gray-600">Aucune question disponible.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion.question_text}</p>
          
          {currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option: string) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full"
          >
            {currentQuestionIndex === questions.length - 1 ? "Terminer" : "Question suivante"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;