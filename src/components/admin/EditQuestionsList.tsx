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
        const { data: existingQuestionnaire, error: questionnaireError } = await supabase
          .from('questionnaires')
          .select('id')
          .eq('contest_id', contestId)
          .maybeSingle();
        
        if (questionnaireError) {
          console.error('Error fetching questionnaire:', questionnaireError);
          throw questionnaireError;
        }

        let questionnaireId;
        
        if (!existingQuestionnaire) {
          console.log('No questionnaire found, creating one...');
          const { data: newQuestionnaire, error: createError } = await supabase
            .from('questionnaires')
            .insert([{
              contest_id: contestId,
              title: "Questionnaire du concours"
            }])
            .select('id')
            .single();
          
          if (createError) {
            console.error('Error creating questionnaire:', createError);
            throw createError;
          }
          
          questionnaireId = newQuestionnaire.id;
          console.log('Created new questionnaire with ID:', questionnaireId);
        } else {
          questionnaireId = existingQuestionnaire.id;
          console.log('Using existing questionnaire ID:', questionnaireId);
        }

        // Then get the questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            options,
            correct_answer,
            article_url,
            order_number
          `)
          .eq('questionnaire_id', questionnaireId)
          .order('order_number', { ascending: true });
        
        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        // Add default type to each question
        const questionsWithType = questionsData?.map(q => ({
          ...q,
          type: 'multiple_choice', // Default type
          questionnaire_id: questionnaireId // Ensure this is included
        })) || [];

        console.log('Fetched questions:', questionsWithType);
        return questionsWithType;
      } catch (error) {
        console.error('Error in question fetching process:', error);
        throw error;
      }
    },
    retry: 1
  });

  const handleAddFromBank = async (bankQuestions: QuestionBankItem[]) => {
    try {
      let questionnaireId;
      const { data: existingQuestionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('contest_id', contestId)
        .maybeSingle();
      
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
        questionnaireId = existingQuestionnaire?.id;
      }

      // Get the last order number, handling the case where no questions exist
      const { data: lastQuestionData } = await supabase
        .from('questions')
        .select('order_number')
        .eq('questionnaire_id', questionnaireId)
        .order('order_number', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle instead of single

      const startOrderNumber = (lastQuestionData?.order_number || 0) + 1;

      const questionsToAdd = bankQuestions.map((q, index) => ({
        questionnaire_id: questionnaireId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
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
                  questions={questions}
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