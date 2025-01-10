import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EditQuestionsListProps {
  contestId?: string | null;
}

const EditQuestionsList: React.FC<EditQuestionsListProps> = ({ contestId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    question: '',
    correct_answer: '',
    wrong_answers: ['', '', ''],
    explanation: '',
    is_active: true,
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (contestId) {
        query.eq('contest_id', contestId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('questions')
        .insert([{
          ...data,
          contest_id: contestId,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      setIsFormOpen(false);
      setFormData({
        question: '',
        correct_answer: '',
        wrong_answers: ['', '', ''],
        explanation: '',
        is_active: true,
      });
      toast({
        title: "Succès",
        description: "La question a été ajoutée",
      });
    },
    onError: (error) => {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('questions')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      setEditingQuestion(null);
      setFormData({
        question: '',
        correct_answer: '',
        wrong_answers: ['', '', ''],
        explanation: '',
        is_active: true,
      });
      toast({
        title: "Succès",
        description: "La question a été mise à jour",
      });
    },
    onError: (error) => {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      toast({
        title: "Succès",
        description: "La question a été supprimée",
      });
    },
    onError: (error) => {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion, data: formData });
    } else {
      addQuestionMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {contestId ? `Questions du concours ${contestId}` : 'Toutes les questions'}
      </h2>

      <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CollapsibleTrigger asChild>
          <Button className="w-full">
            {isFormOpen ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isFormOpen ? "Fermer le formulaire" : "Ajouter une question"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="correct_answer">Bonne réponse</Label>
                  <Input
                    id="correct_answer"
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mauvaises réponses</Label>
                  {formData.wrong_answers.map((answer, index) => (
                    <Input
                      key={index}
                      value={answer}
                      onChange={(e) => {
                        const newWrongAnswers = [...formData.wrong_answers];
                        newWrongAnswers[index] = e.target.value;
                        setFormData({ ...formData, wrong_answers: newWrongAnswers });
                      }}
                      placeholder={`Mauvaise réponse ${index + 1}`}
                      required
                    />
                  ))}
                </div>

                <div>
                  <Label htmlFor="explanation">Explication</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Question active</Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingQuestion ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 gap-4">
        {questions?.map((question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{question.question}</h3>
                  <p className="text-green-600 mt-2">✓ {question.correct_answer}</p>
                  <div className="text-red-600 mt-1">
                    {question.wrong_answers.map((answer, index) => (
                      <p key={index}>✗ {answer}</p>
                    ))}
                  </div>
                  {question.explanation && (
                    <p className="text-gray-600 mt-2 text-sm">{question.explanation}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingQuestion(question.id);
                      setFormData({
                        question: question.question,
                        correct_answer: question.correct_answer,
                        wrong_answers: question.wrong_answers,
                        explanation: question.explanation || '',
                        is_active: question.is_active,
                      });
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
                        deleteQuestionMutation.mutate(question.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>ID: {question.id}</span>
                <span>{question.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EditQuestionsList;