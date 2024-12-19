import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

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
          type: 'multiple_choice' // Ajout explicite du type
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
        description: `${selectedQuestions.length} questions ajoutées au concours`,
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
      <div className="flex gap-4 items-center mb-6">
        <Select value={selectedContestId} onValueChange={setSelectedContestId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Sélectionner un concours" />
          </SelectTrigger>
          <SelectContent>
            {contests?.map((contest) => (
              <SelectItem key={contest.id} value={contest.id}>
                {contest.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleAddToContest}
          disabled={!selectedContestId || selectedQuestions.length === 0}
        >
          Ajouter au concours ({selectedQuestions.length} sélectionnée{selectedQuestions.length > 1 ? 's' : ''})
        </Button>
      </div>

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
