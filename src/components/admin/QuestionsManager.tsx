import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash2, ImagePlus } from "lucide-react";
import QuestionForm from "./QuestionForm";

interface QuestionsManagerProps {
  contestId: string;
}

const QuestionsManager = ({ contestId }: QuestionsManagerProps) => {
  const { toast } = useToast();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: "",
    image_url: "",
  });

  const { data: questions, refetch, isError } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
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
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des questions",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('questions')
        .insert([
          {
            contest_id: contestId,
            question_text: newQuestion.question_text,
            type: newQuestion.type,
            options: newQuestion.options,
            correct_answer: newQuestion.correct_answer,
            article_url: newQuestion.article_url,
            image_url: newQuestion.image_url,
            order_number: (questions?.length || 0) + 1
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée avec succès",
      });

      setNewQuestion({
        question_text: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answer: "",
        article_url: "",
        image_url: "",
      });

      refetch();
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
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
      console.error("Error deleting question:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Erreur lors du chargement des questions</p>
      </div>
    );
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
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  question_text: e.target.value
                })}
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
                    setNewQuestion({
                      ...newQuestion,
                      options: newOptions
                    });
                  }}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>

            <div>
              <Label htmlFor="correct">Réponse correcte</Label>
              <Input
                id="correct"
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  correct_answer: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="article">Lien de l'article</Label>
              <Input
                id="article"
                value={newQuestion.article_url}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  article_url: e.target.value
                })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="image">Image de la question</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const imageUrl = await handleImageUpload(file);
                        setNewQuestion({
                          ...newQuestion,
                          image_url: imageUrl
                        });
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
            </div>

            <Button onClick={handleAddQuestion}>Ajouter la question</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {questions?.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Question {index + 1}
              </CardTitle>
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
            </CardHeader>
            <CardContent>
              {editingQuestionId === question.id ? (
                <QuestionForm
                  question={question}
                  onSave={async (updatedQuestion) => {
                    try {
                      const { error } = await supabase
                        .from('questions')
                        .update(updatedQuestion)
                        .eq('id', question.id);

                      if (error) throw error;

                      toast({
                        title: "Succès",
                        description: "Question mise à jour avec succès",
                      });

                      setEditingQuestionId(null);
                      refetch();
                    } catch (error) {
                      console.error("Error updating question:", error);
                      toast({
                        title: "Erreur",
                        description: "Impossible de mettre à jour la question",
                        variant: "destructive",
                      });
                    }
                  }}
                  onCancel={() => setEditingQuestionId(null)}
                />
              ) : (
                <>
                  <p className="text-sm">{question.question_text}</p>
                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt="Question"
                      className="mt-2 rounded-lg max-h-48 object-cover"
                    />
                  )}
                  {question.options && (
                    <ul className="list-disc list-inside mt-2">
                      {question.options.map((option: string, i: number) => (
                        <li
                          key={i}
                          className={
                            option === question.correct_answer
                              ? "text-green-600"
                              : ""
                          }
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                  {question.article_url && (
                    <a
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 block"
                    >
                      Lien vers l'article
                    </a>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionsManager;