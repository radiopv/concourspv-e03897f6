import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "../App";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  question_text: string;
  type: "multiple_choice" | "open";
  options?: string[];
}

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les questions",
          variant: "destructive",
        });
        return;
      }

      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, [contestId]);

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer,
    });
  };

  const handleSubmit = async () => {
    try {
      // Enregistrer les réponses
      const { error: answersError } = await supabase
        .from('participant_answers')
        .insert(
          Object.entries(answers).map(([questionId, answer]) => ({
            question_id: questionId,
            answer,
            participant_id: contestId, // Vous devrez adapter ceci pour utiliser le vrai participant_id
          }))
        );

      if (answersError) throw answersError;

      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées avec succès !",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des réponses",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement des questions...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestion + 1} sur {questions.length}
        </h2>
        <div className="text-sm text-gray-500">
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg">{currentQ.question_text}</p>

        {currentQ.type === "multiple_choice" ? (
          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={(value) => handleAnswer(value)}
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <Input
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Votre réponse..."
          />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          Précédent
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit}>Terminer</Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!answers[currentQ.id]}
          >
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireComponent;