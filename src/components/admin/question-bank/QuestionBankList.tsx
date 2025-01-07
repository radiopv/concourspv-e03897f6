import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "./QuestionCard";
import { ContestSelector } from "./ContestSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  status: 'available' | 'used';
  last_used_date?: string;
  last_used_contest?: string;
}

const QuestionBankList = ({ questions }: { questions: Question[] }) => {
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

  const availableQuestions = questions.filter(q => q.status === 'available');
  const usedQuestions = questions.filter(q => q.status === 'used');

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

      const currentDate = new Date().toISOString();
      const { data: contestTitle } = await supabase
        .from('contests')
        .select('title')
        .eq('id', selectedContestId)
        .single();

      const { error: updateError } = await supabase
        .from('question_bank')
        .update({ 
          status: 'used',
          last_used_date: currentDate,
          last_used_contest: contestTitle?.title || 'Concours inconnu'
        })
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

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="available" className="flex-1">
            Questions Disponibles ({availableQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="used" className="flex-1">
            Questions Utilisées ({usedQuestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableQuestions.map((question) => (
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
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          {usedQuestions.map((question) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionBankList;