import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Archive, Award, Bell, Edit2, Flag, Save, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    questions?: { count: number };
  };
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean }) => void;
  onSelect: (id: string) => void;
}

const ContestCard = ({ 
  contest, 
  onDelete, 
  onArchive, 
  onFeatureToggle,
  onStatusUpdate,
  onSelect,
}: ContestCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(contest.title);
  const [editedDescription, setEditedDescription] = useState(contest.description || '');
  const { toast } = useToast();
  
  const endDate = new Date(contest.end_date);
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('contests')
        .update({
          title: editedTitle,
          description: editedDescription,
        })
        .eq('id', contest.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les modifications ont été enregistrées",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${contest.status === 'archived' ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-bold text-xl"
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description du concours"
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Sauvegarder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Annuler
              </Button>
            </div>
          </div>
        ) : (
          <>
            <CardTitle 
              className="text-xl font-bold cursor-pointer hover:text-primary transition-colors" 
              onClick={() => onSelect(contest.id)}
            >
              {contest.title}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="hover:bg-primary hover:text-white transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              {contest.status !== 'archived' && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onArchive(contest.id)}
                  className="hover:bg-orange-500 hover:text-white transition-colors"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes les questions et participations seront supprimées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => onDelete(contest.id)}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <div className="space-y-4">
            {contest.description && (
              <p className="text-gray-600 text-sm">{contest.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {contest.is_new && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600">
                  <Flag className="h-3 w-3" /> Nouveau
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" /> Expire bientôt
                </Badge>
              )}
              {contest.has_big_prizes && (
                <Badge variant="default" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
                  <Award className="h-3 w-3" /> Gros lots
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p className="font-medium">Participants</p>
                <p>{contest.participants?.count || 0}</p>
              </div>
              <div>
                <p className="font-medium">Questions</p>
                <p>{contest.questions?.count || 0}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Date de fin</p>
                <p>{format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label htmlFor={`featured-${contest.id}`} className="text-sm font-medium">
                  Afficher sur la page d'accueil
                </label>
                <Switch
                  id={`featured-${contest.id}`}
                  checked={contest.is_featured}
                  onCheckedChange={(checked) => onFeatureToggle(contest.id, checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor={`new-${contest.id}`} className="text-sm font-medium">
                  Marquer comme nouveau
                </label>
                <Switch
                  id={`new-${contest.id}`}
                  checked={contest.is_new}
                  onCheckedChange={(checked) => onStatusUpdate(contest.id, { is_new: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor={`prizes-${contest.id}`} className="text-sm font-medium">
                  Gros lots à gagner
                </label>
                <Switch
                  id={`prizes-${contest.id}`}
                  checked={contest.has_big_prizes}
                  onCheckedChange={(checked) => onStatusUpdate(contest.id, { has_big_prizes: checked })}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContestCard;