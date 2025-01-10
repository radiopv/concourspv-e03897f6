import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash2, ImagePlus, Save, X } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  image_url?: string;
}

const QuestionBankManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: "",
    image_url: "",
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

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

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .insert([{
          question_text: newQuestion.question_text,
          options: newQuestion.options,
          correct_answer: newQuestion.correct_answer,
          article_url: newQuestion.article_url || null,
          image_url: newQuestion.image_url || null,
          status: 'available'
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      
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
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async (questionId: string, updatedData: Partial<Question>) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update(updatedData)
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      setEditingQuestionId(null);
      
      toast({
        title: "Succès",
        description: "Question mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      
      toast({
        title: "Succès",
        description: "Question supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
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
              />
            </div>

            <div>
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <Input
                  key={index}
                  className="mt-2"
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
              />
            </div>

            <div>
              <Label>Lien de l'article</Label>
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
              <Label>Image de la question</Label>
              <div className="flex gap-2">
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
                <Button variant="outline" className="flex items-center gap-2">
                  <ImagePlus className="w-4 h-4" />
                  Ajouter une image
                </Button>
              </div>
              {newQuestion.image_url && (
                <img
                  src={newQuestion.image_url}
                  alt="Question"
                  className="mt-2 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>

            <Button onClick={handleAddQuestion}>Ajouter la question</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {questions?.map((question: Question) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              {editingQuestionId === question.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={question.question_text}
                      onChange={(e) => handleUpdateQuestion(question.id, {
                        question_text: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label>Options</Label>
                    {question.options.map((option, index) => (
                      <Input
                        key={index}
                        className="mt-2"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = e.target.value;
                          handleUpdateQuestion(question.id, {
                            options: newOptions
                          });
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <Label>Réponse correcte</Label>
                    <Input
                      value={question.correct_answer}
                      onChange={(e) => handleUpdateQuestion(question.id, {
                        correct_answer: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label>Lien de l'article</Label>
                    <Input
                      value={question.article_url}
                      onChange={(e) => handleUpdateQuestion(question.id, {
                        article_url: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label>Image</Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const imageUrl = await handleImageUpload(file);
                              handleUpdateQuestion(question.id, {
                                image_url: imageUrl
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
                      <Button variant="outline" className="flex items-center gap-2">
                        <ImagePlus className="w-4 h-4" />
                        Modifier l'image
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setEditingQuestionId(null)} className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Enregistrer
                    </Button>
                    <Button variant="outline" onClick={() => setEditingQuestionId(null)} className="flex items-center gap-2">
                      <X className="w-4 h-4" /> Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{question.question_text}</h3>
                      <div className="space-y-1">
                        {question.options.map((option, index) => (
                          <p
                            key={index}
                            className={option === question.correct_answer ? "text-green-600" : ""}
                          >
                            {option}
                          </p>
                        ))}
                      </div>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingQuestionId(question.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt="Question"
                      className="rounded-lg max-h-48 object-cover"
                    />
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

export default QuestionBankManager;