import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Edit2, Trash2 } from "lucide-react";
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

interface ContestCardHeaderProps {
  title: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  contestId: string;
  status: string;
}

const ContestCardHeader = ({
  title,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
  contestId,
  status
}: ContestCardHeaderProps) => {
  return (
    <>
      <CardTitle 
        className="text-xl font-bold cursor-pointer hover:text-primary transition-colors" 
        onClick={() => onSelect(contestId)}
      >
        {title}
      </CardTitle>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(contestId)}
          className="hover:bg-primary hover:text-white transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        {status !== 'archived' && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onArchive(contestId)}
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
                onClick={() => onDelete(contestId)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default ContestCardHeader;