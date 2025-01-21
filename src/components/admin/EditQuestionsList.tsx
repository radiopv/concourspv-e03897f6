import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types/database';

interface EditQuestionsListProps {
  contestId?: string;
}

const EditQuestionsList: React.FC<EditQuestionsListProps> = ({ contestId: propContestId }) => {
  const { contestId: urlContestId } = useParams();
  const finalContestId = propContestId || urlContestId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newQuestion, setNewQuestion] = React.useState({
    question_text: '',
    correct_answer: '',
    options: ['', '', '', ''],
    article_url: '',
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', finalContestId],
    queryFn: async () => {
      if (!finalContestId) throw new Error('Contest ID is required');

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', finalContestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Question[];
    },
    enabled: !!finalContestId,
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: Omit<Question, 'id'>) => {
      if (!finalContestId) throw new Error('Contest ID is required');

      console.log('Adding question with contest_id:', finalContestId);
      
      const { data, error } = await supabase
        .from('questions')
        .insert([{ 
          ...questionData, 
          contest_id: finalContestId,
          type: 'multiple_choice'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding question:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', finalContestId] });
      setNewQuestion({
        question_text: '',
        correct_answer: '',
        options: ['', '', '', ''],
        article_url: '',
      });
      toast({
        title: 'Question ajoutée',
        description: 'La question a été ajoutée avec succès.',
      });
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la question.',
        variant: 'destructive',
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', finalContestId] });
      toast({
        title: 'Question supprimée',
        description: 'La question a été supprimée avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la question.',
        variant: 'destructive',
      });
    },
  });

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalContestId) {
      toast({
        title: 'Erreur',
        description: 'ID du concours manquant',
        variant: 'destructive',
      });
      return;
    }

    addQuestionMutation.mutate({
      question_text: newQuestion.question_text,
      correct_answer: newQuestion.correct_answer,
      options: newQuestion.options,
      article_url: newQuestion.article_url,
      contest_id: finalContestId,
      type: 'multiple_choice',
    });
  };

  if (!finalContestId) {
    return <div>L'ID du concours est requis</div>;
  }

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="correct_answer">Réponse correcte</Label>
              <Input
                id="correct_answer"
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                required
              />
            </div>

            {newQuestion.options.map((option, index) => (
              <div key={index}>
                <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}

            <div>
              <Label htmlFor="article_url">URL de l'article (optionnel)</Label>
              <Input
                id="article_url"
                type="url"
                value={newQuestion.article_url}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, article_url: e.target.value }))}
              />
            </div>

            <Button type="submit">Ajouter la question</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions existantes</CardTitle>
        </CardHeader>
        <CardContent>
          {questions && questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{question.question_text}</h3>
                      <p className="text-sm text-green-600">Réponse correcte: {question.correct_answer}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Options:</p>
                        <ul className="list-disc list-inside">
                          {question.options.map((option, index) => (
                            <li key={index} className="text-sm">{option}</li>
                          ))}
                        </ul>
                      </div>
                      {question.article_url && (
                        <a
                          href={question.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-2 block"
                        >
                          Lien vers l'article
                        </a>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteQuestionMutation.mutate(question.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Aucune question n'a été ajoutée</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditQuestionsList;