import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "./QuestionCard";
import { ContestSelector } from "./ContestSelector";

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

  const { data: contests } = useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('id, title')
        .in('status', ['draft', 'active'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

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
      const { data: existingQuestions } = await supabase
        .from('questions')
        .select('order_number')
        .eq('contest_id', selectedContestId)
        .order('order_number', { ascending: false })
        .limit(1);

      const startOrderNumber = (existingQuestions?.[0]?.order_number || 0) + 1;

      const selectedQuestionsData = questions
        .filter(q => selectedQuestions.includes(q.id))
        .map((q, index) => ({
          contest_id: selectedContestId,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          order_number: startOrderNumber + index,
          type: 'multiple_choice'
        }));

      const { error: insertError } = await supabase
        .from('questions')
        .insert(selectedQuestionsData);

      if (insertError) throw insertError;

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
        description: `${selectedQuestions.length} questions ajoutées au concours`,
      });

      setSelectedQuestions([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout des questions au concours",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ContestSelector
        contests={contests}
        selectedContestId={selectedContestId}
        selectedQuestionsCount={selectedQuestions.length}
        onContestSelect={setSelectedContestId}
        onAddToContest={handleAddToContest}
      />

      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          isSelected={selectedQuestions.includes(question.id)}
          onSelect={() => {
            if (selectedQuestions.includes(question.id)) {
              setSelectedQuestions(prev => prev.filter(id => id !== question.id));
            } else {
              setSelectedQuestions(prev => [...prev, question.id]);
            }
          }}
        />
      ))}
    </div>
  );
};

export default QuestionBankList;