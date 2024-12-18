import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Archive, Award, Bell, Flag, Trash2 } from "lucide-react";
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

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
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
  const endDate = new Date(contest.end_date);
  const isExpiringSoon = endDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <Card className={`hover:shadow-lg transition-shadow ${contest.status === 'archived' ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle 
          className="text-xl font-bold cursor-pointer" 
          onClick={() => onSelect(contest.id)}
        >
          {contest.title}
        </CardTitle>
        <div className="flex space-x-2">
          {contest.status !== 'archived' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onArchive(contest.id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {contest.is_new && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flag className="h-3 w-3" /> Nouveau
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Bell className="h-3 w-3" /> Expire bientôt
              </Badge>
            )}
            {contest.has_big_prizes && (
              <Badge variant="default" className="flex items-center gap-1 bg-amber-500">
                <Award className="h-3 w-3" /> Gros lots
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {contest.participants?.count || 0} participants
            </p>
            <p className="text-sm text-gray-500">
              {contest.questions?.count || 0} questions
            </p>
            <p className="text-sm text-gray-500">
              Fin le {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>

          <div className="space-y-2">
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
      </CardContent>
    </Card>
  );
};

export default ContestCard;