import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import QuestionAccordion from './questions/QuestionAccordion';
import { QuestionBankList } from './question-bank/QuestionBankList';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuestionnaireQuestions } from './hooks/useQuestionnaireQuestions';
import { useQuestionBankActions } from './hooks/useQuestionBankActions';

interface EditQuestionsListProps {
  contestId: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const queryClient = useQueryClient();
  const { data: questions = [], isLoading, error } = useQuestionnaireQuestions(contestId);
  const { isOpen, setIsOpen, handleAddFromBank } = useQuestionBankActions(contestId);

  // Fetch question bank items
  const { data: bankQuestions = [] } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  if (error) {
    console.error('Error loading questions:', error);
    return (
      <div className="text-red-500">
        Une erreur est survenue lors du chargement des questions. 
        Veuillez réessayer plus tard.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions du concours</CardTitle>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter des questions
              {isOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <QuestionBankList 
                  questions={bankQuestions}
                  onAddToContest={handleAddFromBank}
                />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {questions?.map((question, index) => (
            <QuestionAccordion
              key={question.id}
              question={question}
              index={index}
              onDelete={() => {}}
              onUpdate={() => queryClient.invalidateQueries({ queryKey: ['questions', contestId] })}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;