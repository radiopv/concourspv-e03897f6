import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";

interface QuestionsManagerProps {
  contestId: string;
}

const QuestionsManager = ({ contestId }: QuestionsManagerProps) => {
  const { toast } = useToast();
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const { data: questions, refetch } = useQuery({
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
        .insert([
          {
            contest_id: contestId,
            question_text: newQuestion.question_text,
            type: newQuestion.type,
            options: newQuestion.options,
            correct_answer: newQuestion.correct_answer,
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
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive",
      });
    }
  };

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

            <Button onClick={handleAddQuestion}>Ajouter la question</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {questions?.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{question.question_text}</p>
              {question.options && (
                <ul className="list-disc list-inside mt-2">
                  {question.options.map((option: string, i: number) => (
                    <li key={i} className={option === question.correct_answer ? "text-green-600" : ""}>
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionsManager;