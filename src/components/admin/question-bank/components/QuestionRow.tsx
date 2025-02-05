import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, Trash2, X, ExternalLink } from "lucide-react";
import { Question } from '@/types/database';

interface QuestionRowProps {
  question: Question;
  editingId: string | null;
  editedQuestion: Partial<Question>;
  contests: any[];
  onEdit: (question: Question) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onAddToContest: (questionId: string, contestId: string) => void;
  setEditedQuestion: (question: Partial<Question>) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'in_use':
      return 'bg-blue-100 text-blue-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const QuestionRow = ({
  question,
  editingId,
  editedQuestion,
  contests,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddToContest,
  setEditedQuestion,
}: QuestionRowProps) => {
  const isEditing = editingId === question.id;

  return (
    <TableRow key={question.id}>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedQuestion.question_text || question.question_text}
            onChange={(e) => setEditedQuestion({
              ...editedQuestion,
              question_text: e.target.value
            })}
          />
        ) : (
          question.question_text
        )}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(question.status)}>
          {question.status}
        </Badge>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedQuestion.correct_answer || question.correct_answer}
            onChange={(e) => setEditedQuestion({
              ...editedQuestion,
              correct_answer: e.target.value
            })}
          />
        ) : (
          <span className="text-green-600 font-medium">
            {question.correct_answer}
          </span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="space-y-2">
            {(editedQuestion.options || question.options)?.map((option: string, index: number) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...(editedQuestion.options || question.options)];
                  newOptions[index] = e.target.value;
                  setEditedQuestion({
                    ...editedQuestion,
                    options: newOptions
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <ul className="list-disc list-inside">
            {question.options?.map((option: string, index: number) => (
              <li key={index} className={option === question.correct_answer ? "text-green-600" : ""}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedQuestion.article_url || question.article_url}
            onChange={(e) => setEditedQuestion({
              ...editedQuestion,
              article_url: e.target.value
            })}
          />
        ) : (
          question.article_url && (
            <a
              href={question.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Voir l'article
            </a>
          )
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSave(question.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Select
                onValueChange={(contestId) => onAddToContest(question.id, contestId)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ajouter au concours" />
                </SelectTrigger>
                <SelectContent>
                  {contests?.map((contest) => (
                    <SelectItem key={contest.id} value={contest.id}>
                      {contest.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(question)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(question.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default QuestionRow;