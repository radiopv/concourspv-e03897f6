import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditQuestionsListProps {
  contestId: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null);
  const [newQuestion, setNewQuestion] = React.useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: "",
    image_url: "",
  });

  const { data: questions, refetch, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: newQuestion.question_text,
          options: newQuestion.options.filter(opt => opt !== ""),
          correct_answer: newQuestion.correct_answer,
          article_url: newQuestion.article_url || null,
          image_url: newQuestion.image_url || null,
          order_number: (questions?.length || 0) + 1,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée avec succès",
      });

      setNewQuestion({
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
        article_url: "",
        image_url: "",
      });

      refetch();
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async (questionId: string, updatedData: any) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update(updatedData)
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question mise à jour avec succès",
      });

      setEditingQuestionId(null);
      refetch();
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question supprimée avec succès",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('questions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('questions')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

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
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion(prev => ({
                  ...prev,
                  question_text: e.target.value
                }))}
                placeholder="Entrez votre question"
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion(prev => ({
                      ...prev,
                      options: newOptions
                    }));
                  }}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>

            <div>
              <Label>Réponse correcte</Label>
              <Input
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion(prev => ({
                  ...prev,
                  correct_answer: e.target.value
                }))}
                placeholder="Entrez la réponse correcte"
              />
            </div>

            <div>
              <Label>Lien de l'article (optionnel)</Label>
              <Input
                value={newQuestion.article_url}
                onChange={(e) => setNewQuestion(prev => ({
                  ...prev,
                  article_url: e.target.value
                }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Image de la question (optionnel)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const imageUrl = await handleImageUpload(file);
                      setNewQuestion(prev => ({
                        ...prev,
                        image_url: imageUrl
                      }));
                      toast({
                        title: "Succès",
                        description: "Image téléchargée avec succès",
                      });
                    } catch (error) {
                      toast({
                        title: "Erreur",
                        description: "Impossible de télécharger l'image",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              />
              {newQuestion.image_url && (
                <img
                  src={newQuestion.image_url}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded-lg"
                />
              )}
            </div>

            <Button onClick={handleAddQuestion} className="w-full">
              Ajouter la question
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions?.map((question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              {editingQuestionId === question.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={question.question_text}
                      onChange={(e) => {
                        const updatedQuestion = { ...question, question_text: e.target.value };
                        handleUpdateQuestion(question.id, updatedQuestion);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options.map((option: string, index: number) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = e.target.value;
                          const updatedQuestion = { ...question, options: newOptions };
                          handleUpdateQuestion(question.id, updatedQuestion);
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <Label>Réponse correcte</Label>
                    <Input
                      value={question.correct_answer}
                      onChange={(e) => {
                        const updatedQuestion = { ...question, correct_answer: e.target.value };
                        handleUpdateQuestion(question.id, updatedQuestion);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Lien de l'article</Label>
                    <Input
                      value={question.article_url || ''}
                      onChange={(e) => {
                        const updatedQuestion = { ...question, article_url: e.target.value };
                        handleUpdateQuestion(question.id, updatedQuestion);
                      }}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label>Image de la question</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const imageUrl = await handleImageUpload(file);
                            const updatedQuestion = { ...question, image_url: imageUrl };
                            handleUpdateQuestion(question.id, updatedQuestion);
                          } catch (error) {
                            toast({
                              title: "Erreur",
                              description: "Impossible de télécharger l'image",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                    {question.image_url && (
                      <img
                        src={question.image_url}
                        alt="Question"
                        className="mt-2 max-h-40 rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setEditingQuestionId(null)}>
                      Terminer
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{question.question_text}</h3>
                      <div className="mt-2">
                        {question.options.map((option: string, index: number) => (
                          <p
                            key={index}
                            className={option === question.correct_answer ? "text-green-600" : ""}
                          >
                            {option}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => setEditingQuestionId(question.id)}>
                      Modifier
                    </Button>
                  </div>

                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt="Question"
                      className="mt-2 max-h-40 rounded-lg"
                    />
                  )}

                  {question.article_url && (
                    <a
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Lien vers l'article
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EditQuestionsList;