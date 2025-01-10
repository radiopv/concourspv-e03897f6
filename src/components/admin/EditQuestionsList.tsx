import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, ImagePlus, Save, X } from "lucide-react";

interface EditQuestionsListProps {
  contestId: string;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  image_url?: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Question>>({});

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, image_url, order_number')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data as Question[];
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

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      
      toast({
        title: "Succès",
        description: "La question a été supprimée",
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

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contestId,
          question_text: "Nouvelle question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct_answer: "Option 1",
          order_number: (questions?.length || 0) + 1,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      
      toast({
        title: "Succès",
        description: "La question a été ajoutée",
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

  const handleSaveEdit = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update(editFormData)
        .eq('id', questionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      setEditingQuestionId(null);
      setEditFormData({});
      
      toast({
        title: "Succès",
        description: "La question a été mise à jour",
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

  if (isLoading) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions du concours</CardTitle>
        <Button
          onClick={handleAddQuestion}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter une question
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions?.map((question) => (
          <Card key={question.id} className="p-4">
            {editingQuestionId === question.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    value={editFormData.question_text || question.question_text}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      question_text: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label>Options</Label>
                  {question.options.map((option, index) => (
                    <Input
                      key={index}
                      className="mt-2"
                      value={editFormData.options?.[index] || option}
                      onChange={(e) => {
                        const newOptions = [...(editFormData.options || question.options)];
                        newOptions[index] = e.target.value;
                        setEditFormData(prev => ({
                          ...prev,
                          options: newOptions
                        }));
                      }}
                    />
                  ))}
                </div>

                <div>
                  <Label>Réponse correcte</Label>
                  <Input
                    value={editFormData.correct_answer || question.correct_answer}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      correct_answer: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label>Lien de l'article</Label>
                  <Input
                    value={editFormData.article_url || question.article_url}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      article_url: e.target.value
                    }))}
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
                            setEditFormData(prev => ({
                              ...prev,
                              image_url: imageUrl
                            }));
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
                  {(editFormData.image_url || question.image_url) && (
                    <img
                      src={editFormData.image_url || question.image_url}
                      alt="Question"
                      className="mt-2 rounded-lg max-h-48 object-cover"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSaveEdit(question.id)} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Enregistrer
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditingQuestionId(null);
                    setEditFormData({});
                  }} className="flex items-center gap-2">
                    <X className="w-4 h-4" /> Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{question.question_text}</h3>
                    <div className="mt-2">
                      {question.options.map((option, index) => (
                        <p key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                          {option}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingQuestionId(question.id);
                        setEditFormData({});
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      Supprimer
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
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default EditQuestionsList;