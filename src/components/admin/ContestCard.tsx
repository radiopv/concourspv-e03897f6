import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import ContestCardStats from './contest-card/ContestCardStats';
import ContestCardToggles from './contest-card/ContestCardToggles';
import ContestCardBadges from './contest-card/ContestCardBadges';
import ContestCardPrize from './contest-card/ContestCardPrize';
import ContestStatusBadge from './contest-card/ContestStatusBadge';
import ContestDrawSection from './contest-card/ContestDrawSection';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Plus, Trash2 } from "lucide-react";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    draw_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    questions?: { count: number };
  };
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean; status?: string }) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContestCard = ({ 
  contest, 
  onDelete, 
  onArchive, 
  onFeatureToggle,
  onStatusUpdate,
  onSelect,
  onEdit,
}: ContestCardProps) => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    article_url: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions } = useQuery({
    queryKey: ['questions', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contest.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddQuestion = async () => {
    try {
      if (!newQuestion.question_text || !newQuestion.correct_answer) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir au moins la question et la bonne réponse",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('questions')
        .insert([{
          contest_id: contest.id,
          question_text: newQuestion.question_text,
          options: newQuestion.options.filter(opt => opt !== ""),
          correct_answer: newQuestion.correct_answer,
          article_url: newQuestion.article_url || null,
          type: 'multiple_choice'
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question ajoutée avec succès"
      });

      setNewQuestion({
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
        article_url: ""
      });

      setShowAddQuestion(false);
      queryClient.invalidateQueries({ queryKey: ['questions', contest.id] });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question",
        variant: "destructive"
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
        description: "Question supprimée avec succès"
      });

      // Invalider le cache pour recharger les questions
      queryClient.invalidateQueries({ queryKey: ['questions', contest.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${contest.status === 'archived' ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <ContestCardHeader
          title={contest.title}
          onSelect={onSelect}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          contestId={contest.id}
          status={contest.status}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Questions ({questions?.length || 0})</h3>
            <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={newQuestion.question_text}
                      onChange={(e) => setNewQuestion(prev => ({
                        ...prev,
                        question_text: e.target.value
                      }))}
                      placeholder="Entrez la question..."
                    />
                  </div>
                  {newQuestion.options.map((option, index) => (
                    <div key={index}>
                      <Label>Option {index + 1}</Label>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion(prev => ({
                            ...prev,
                            options: newOptions
                          }));
                        }}
                        placeholder={`Option ${index + 1}...`}
                      />
                    </div>
                  ))}
                  <div>
                    <Label>Bonne réponse</Label>
                    <Input
                      value={newQuestion.correct_answer}
                      onChange={(e) => setNewQuestion(prev => ({
                        ...prev,
                        correct_answer: e.target.value
                      }))}
                      placeholder="Entrez la bonne réponse..."
                    />
                  </div>
                  <div>
                    <Label>URL de l'article (optionnel)</Label>
                    <Input
                      value={newQuestion.article_url}
                      onChange={(e) => setNewQuestion(prev => ({
                        ...prev,
                        article_url: e.target.value
                      }))}
                      placeholder="https://..."
                    />
                  </div>
                  <Button onClick={handleAddQuestion} className="w-full">
                    Ajouter la question
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            {questions?.map((question) => (
              <div key={question.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm truncate flex-1">{question.question_text}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;
