import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContestCardHeader from './contest-card/ContestCardHeader';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Plus, Trash2, RotateCcw, Gift } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Contest } from "@/types/contest";
import PrizeCatalogDisplay from './prize-catalog/PrizeCatalogDisplay';

interface ContestCardProps {
  contest: Contest;
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
  const [showPrizes, setShowPrizes] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions, refetch } = useQuery({
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

  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          id,
          catalog_item:prize_catalog (
            id,
            name,
            description,
            image_url,
            shop_url,
            value
          )
        `)
        .eq('contest_id', contest.id);
      
      if (error) throw error;
      return data?.map(prize => prize.catalog_item) || [];
    }
  });

  const handleResetContest = async () => {
    try {
      // 1. Créer une copie du concours
      const { data: newContest, error: copyError } = await supabase
        .from('contests')
        .insert([{
          title: `${contest.title} (Nouveau)`,
          description: contest.description,
          start_date: new Date().toISOString(),
          end_date: contest.end_date,
          draw_date: contest.draw_date,
          is_featured: false,
          is_new: true,
          has_big_prizes: contest.has_big_prizes,
          status: 'active',
          shop_url: contest.shop_url,
          prize_image_url: contest.prize_image_url
        }])
        .select()
        .single();

      if (copyError) throw copyError;

      // 2. Copier les questions du concours original
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contest.id);

      if (questionsError) throw questionsError;

      if (questions && questions.length > 0) {
        const newQuestions = questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          contest_id: newContest.id,
          type: q.type,
          created_at: new Date().toISOString()
        }));

        const { error: insertQuestionsError } = await supabase
          .from('questions')
          .insert(newQuestions);

        if (insertQuestionsError) throw insertQuestionsError;
      }

      // 3. Archiver l'ancien concours
      const { error: archiveError } = await supabase
        .from('contests')
        .update({ status: 'archived' })
        .eq('id', contest.id);

      if (archiveError) throw archiveError;

      // 4. Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-contests'] });

      toast({
        title: "Succès",
        description: "Le concours a été réinitialisé avec succès",
      });
    } catch (error) {
      console.error('Error resetting contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser le concours",
        variant: "destructive",
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

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-500" />
                Prix à gagner ({prizes?.length || 0})
              </h3>
              <Dialog open={showPrizes} onOpenChange={setShowPrizes}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-gradient-to-r from-amber-500 to-purple-500 text-white hover:from-amber-600 hover:to-purple-600">
                    <Plus className="w-4 h-4 mr-1" /> Gérer les prix
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Gestion des prix du concours</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <PrizeCatalogDisplay prizes={prizes || []} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {prizes && prizes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prizes.slice(0, 2).map((prize) => (
                  <div key={prize.id} className="relative group overflow-hidden rounded-lg border border-gray-200">
                    {prize.image_url && (
                      <div className="aspect-video relative">
                        <img
                          src={prize.image_url}
                          alt={prize.name}
                          className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                        />
                        {prize.value && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-sm">
                            {prize.value}€
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-2 bg-white/80">
                      <p className="font-medium text-sm text-purple-700">{prize.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser le concours
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser le concours</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va créer une nouvelle copie du concours et archiver la version actuelle.
                  Toutes les participations seront conservées dans la version archivée.
                  Êtes-vous sûr de vouloir continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetContest}>
                  Réinitialiser
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;
