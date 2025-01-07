import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import QuestionAccordion from './questions/QuestionAccordion';
import { QuestionBankList } from './question-bank/QuestionBankList';
import { Question, QuestionBankItem } from '@/types/question';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EditQuestionsListProps {
  contestId: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId);
      
      try {
        // First get or create the questionnaire
        let questionnaireId;
        const { data: existingQuestionnaire, error: questionnaireError } = await supabase
          .from('questionnaires')
          .select('id')
          .eq('contest_id', contestId)
          .maybeSingle();
        
        if (questionnaireError) {
          console.error('Error fetching questionnaire:', questionnaireError);
          throw questionnaireError;
        }

        if (!existingQuestionnaire) {
          console.log('No questionnaire found, creating one...');
          const { data: newQuestionnaire, error: createError } = await supabase
            .from('questionnaires')
            .insert([{
              contest_id: contestId,
              title: "Questionnaire du concours",
            }])
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating questionnaire:', createError);
            throw createError;
          }
          
          questionnaireId = newQuestionnaire.id;
        } else {
          questionnaireId = existingQuestionnaire.id;
        }

        console.log('Using questionnaire ID:', questionnaireId);

        // Then get the questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            options,
            correct_answer,
            article_url,
            type,
            order_number
          `)
          .eq('questionnaire_id', questionnaireId)
          .order('order_number', { ascending: true });
        
        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        console.log('Fetched questions:', questionsData);
        return questionsData || [];
      } catch (error) {
        console.error('Error in question fetching process:', error);
        throw error;
      }
    },
    enabled: !!contestId
  });

  const { data: bankQuestions = [] } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      return data as QuestionBankItem[];
    }
  });

  const handleAddFromBank = async (bankQuestions: QuestionBankItem[]) => {
    try {
      let questionnaireId;
      const { data: existingQuestionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .single();
      
      if (questionnaireError) {
        const { data: newQuestionnaire, error: createError } = await supabase
          .from('questionnaires')
          .insert([{
            contest_id: contestId,
            title: "Questionnaire du concours",
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        questionnaireId = newQuestionnaire.id;
      } else {
        questionnaireId = existingQuestionnaire.id;
      }

      const { data: lastQuestion } = await supabase
        .from('questions')
        .select('order_number')
        .eq('questionnaire_id', questionnaireId)
        .order('order_number', { ascending: false })
        .limit(1)
        .single();

      const startOrderNumber = (lastQuestion?.order_number || 0) + 1;

      const questionsToAdd = bankQuestions.map((q, index) => ({
        questionnaire_id: questionnaireId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        type: 'multiple_choice',
        order_number: startOrderNumber + index
      }));

      const { error } = await supabase
        .from('questions')
        .insert(questionsToAdd);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: `${bankQuestions.length} questions ont été ajoutées`,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding questions from bank:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Une erreur est survenue lors du chargement des questions</div>;
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