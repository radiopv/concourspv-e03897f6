import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "./QuestionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionBankItem } from "@/types/question";

interface QuestionBankListProps {
  onAddToContest: (questions: QuestionBankItem[]) => Promise<void>;
}

const QuestionBankList = ({ onAddToContest }: QuestionBankListProps) => {
  const { toast } = useToast();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuestionBankItem[];
    }
  });

  const handleAddToContest = async () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une question",
        variant: "destructive",
      });
      return;
    }

    const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));
    await onAddToContest(selectedQuestionsData);
    setSelectedQuestions([]);
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  const availableQuestions = questions.filter(q => q.status === 'available');
  const usedQuestions = questions.filter(q => q.status === 'used');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Questions sélectionnées: {selectedQuestions.length}
        </h2>
        <button
          onClick={handleAddToContest}
          disabled={selectedQuestions.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Ajouter au concours
        </button>
      </div>

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