import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  status: 'available' | 'used';
}

interface QuestionBankListProps {
  questions: Question[];
}

const QuestionBankList = ({ questions }: QuestionBankListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>("");

  const handleAddToContest = async () => {
    if (!selectedContestId || selectedQuestions.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un concours et au moins une question",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedQuestionsData = questions
        .filter(q => selectedQuestions.includes(q.id))
        .map((q, index) => ({
          contest_id: selectedContestId,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          order_number: index + 1,
          type: 'multiple_choice'
        }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(selectedQuestionsData);

      if (questionsError) throw questionsError;

      // Mettre à jour le statut des questions dans la banque
      const { error: updateError } = await supabase
        .from('question_bank')
        .update({ status: 'used' })
        .in('id', selectedQuestions);

      if (updateError) throw updateError;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['question-bank'] }),
        queryClient.invalidateQueries({ queryKey: ['questions', selectedContestId] })
      ]);

      toast({
        title: "Succès",
        description: "Questions ajoutées au concours avec succès",
      });

      setSelectedQuestions([]);
    } catch (error) {
      console.error('Error adding questions to contest:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout des questions au concours",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className={`
          ${selectedQuestions.includes(question.id) ? 'border-primary' : ''}
          ${question.status === 'used' ? 'opacity-50' : ''}
        `}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">{question.question_text}</p>
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, index) => (
                    <li key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="outline"
                disabled={question.status === 'used'}
                onClick={() => {
                  if (selectedQuestions.includes(question.id)) {
                    setSelectedQuestions(prev => prev.filter(id => id !== question.id));
                  } else {
                    setSelectedQuestions(prev => [...prev, question.id]);
                  }
                }}
              >
                {selectedQuestions.includes(question.id) ? 'Désélectionner' : 'Sélectionner'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionBankList;