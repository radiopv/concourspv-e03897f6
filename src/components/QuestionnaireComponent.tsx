import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { ensureParticipantExists } from './questionnaire/ParticipantManager';

const QuestionnaireComponent = ({ contestId }: { contestId: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les questions.",
          variant: "destructive",
        });
      } else {
        setQuestions(data);
      }
    };

    fetchQuestions();
  }, [contestId, toast]);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      const participantId = await ensureParticipantExists(session.session.user.id, contestId);

      const { error } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: questions[currentQuestionIndex].id,
          answer: selectedAnswer
        }]);

      if (error) throw error;

      toast({
        title: "Réponse enregistrée",
        description: "Votre réponse a été soumise avec succès.",
      });

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <div>
          <h2>{questions[currentQuestionIndex].question_text}</h2>
          {questions[currentQuestionIndex].options.map((option: string, index: number) => (
            <div key={index}>
              <input
                type="radio"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => setSelectedAnswer(option)}
              />
              {option}
            </div>
          ))}
          <button onClick={handleSubmitAnswer} disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Soumettre"}
          </button>
        </div>
      ) : (
        <div>
          <h2>Merci d'avoir participé !</h2>
          <button onClick={() => navigate('/contests')}>Retour aux concours</button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireComponent;

