import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";
import { Pencil, Trash2, Save, X, Link } from "lucide-react";
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

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

interface QuestionAccordionProps {
  question: Question;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const QuestionAccordion = ({ question, index, onDelete, onUpdate }: QuestionAccordionProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = React.useState({
    question_text: question.question_text,
    options: [...question.options],
    correct_answer: question.correct_answer,
    article_url: question.article_url || '',
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: formData.question_text,
          options: formData.options,
          correct_answer: formData.correct_answer,
          article_url: formData.article_url
        })
        .eq('id', question.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Question mise à jour",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      question_text: question.question_text,
      options: [...question.options],
      correct_answer: question.correct_answer,
      article_url: question.article_url || '',
    });
    setIsEditing(false);
  };

  return (
    <AccordionItem value={question.id} className="border rounded-lg mb-4 bg-white">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span className="font-bold">Question {index + 1}</span>
            <span className="text-sm text-gray-600">{formData.question_text}</span>
          </div>
          <div className="flex items-center gap-2">
            {formData.article_url && (
              <Link className="h-4 w-4 text-blue-500" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. La question sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => onDelete(question.id)}
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question</label>
            <Input
              value={formData.question_text}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                question_text: e.target.value
              }))}
              disabled={!isEditing}
              placeholder="Texte de la question"
            />
          </div>

          <div>
            <label className="text-sm font-medium">URL de l'article</label>
            <Input
              value={formData.article_url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                article_url: e.target.value
              }))}
              disabled={!isEditing}
              placeholder="https://..."
            />
          </div>

          {formData.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <label className="text-sm font-medium">
                Option {optionIndex + 1}
                {option === formData.correct_answer && (
                  <span className="text-green-600 ml-2">(Réponse correcte)</span>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[optionIndex] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      options: newOptions
                    }));
                  }}
                  disabled={!isEditing}
                />
                <Button
                  variant="outline"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    correct_answer: option
                  }))}
                  disabled={!isEditing}
                  className={option === formData.correct_answer ? "bg-green-50" : ""}
                >
                  ✓
                </Button>
              </div>
            </div>
          ))}

          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" /> Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Enregistrer
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordion;