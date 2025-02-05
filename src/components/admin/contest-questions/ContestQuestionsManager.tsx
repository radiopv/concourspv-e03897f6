import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Question } from "@/types/database";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const ContestQuestionsManager = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
      console.log('Fetching questions for contest:', contestId);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId);
      
      if (error) {
        console.error('Error fetching contest questions:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!contestId
  });

  const questionsNeeded = 25 - (questions?.length || 0);

  const autoFillQuestions = async () => {
    if (!contestId) return;
    setIsAutoFilling(true);

    try {
      // Récupérer les questions disponibles
      const { data: availableQuestions, error: fetchError } = await supabase
        .from('questions')
        .select('*')
        .eq('status', 'available')
        .is('contest_id', null)
        .limit(questionsNeeded);

      if (fetchError) throw fetchError;

      if (!availableQuestions || availableQuestions.length === 0) {
        toast({
          title: "Attention",
          description: "Aucune question disponible dans la banque de questions.",
          variant: "destructive",
        });
        return;
      }

      // Ajouter les questions au concours
      const { error: updateError } = await supabase
        .from('questions')
        .update({ 
          contest_id: contestId,
          status: 'in_use'
        })
        .in('id', availableQuestions.map(q => q.id));

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ['contest-questions', contestId] });
      
      toast({
        title: "Succès",
        description: `${availableQuestions.length} questions ont été ajoutées au concours.`,
      });
    } catch (error) {
      console.error('Error auto-filling questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les questions automatiquement.",
        variant: "destructive",
      });
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleAddQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ 
          contest_id: contestId,
          status: 'in_use'
        })
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contest-questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
      
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée au concours avec succès",
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question au concours",
        variant: "destructive",
      });
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ 
          contest_id: null,
          status: 'available'
        })
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contest-questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['questions-bank'] });
      
      toast({
        title: "Question retirée",
        description: "La question a été retirée du concours",
      });
    } catch (error) {
      console.error('Error removing question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la question du concours",
        variant: "destructive",
      });
    }
  };

  if (questionsLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Gestion des Questions du Concours</h1>
      </div>

      {/* Questions Counter Alert */}
      {questionsNeeded > 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Il manque {questionsNeeded} question{questionsNeeded > 1 ? 's' : ''} pour atteindre les 25 questions requises.
            </span>
            <Button
              onClick={autoFillQuestions}
              disabled={isAutoFilling}
              className="ml-4"
            >
              {isAutoFilling ? (
                "Ajout en cours..."
              ) : (
                "Ajouter automatiquement"
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Questions Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span>Questions dans ce concours</span>
              <Badge variant="secondary">{questions?.length || 0} / 25</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span>Questions manquantes</span>
              <Badge variant={questionsNeeded > 0 ? "destructive" : "secondary"}>
                {questionsNeeded}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {availableQuestions?.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{question.question_text}</h3>
                        <div className="space-y-1 text-sm text-gray-500">
                          {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
                            <p key={index} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option}
                            </p>
                          ))}
                        </div>
                        {question.article_url && (
                          <a
                            href={question.article_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                          >
                            Voir l'article <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddQuestion(question.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Contest Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Questions du Concours</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {questions?.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <h3 className="font-medium">{question.question_text}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-500">
                          {Array.isArray(question.options) && question.options.map((option: string, optionIndex: number) => (
                            <p key={optionIndex} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option}
                            </p>
                          ))}
                        </div>
                        {question.article_url && (
                          <a
                            href={question.article_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                          >
                            Voir l'article <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        Retirer
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestQuestionsManager;
