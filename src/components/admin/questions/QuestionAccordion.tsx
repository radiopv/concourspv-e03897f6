import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";
import { Pencil, Trash2, Link } from "lucide-react";
import QuestionEditForm from './QuestionEditForm';
import DeleteQuestionDialog from './DeleteQuestionDialog';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    question_text: question.question_text,
    options: [...question.options],
    correct_answer: question.correct_answer,
    article_url: question.article_url || '',
  });

  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleDelete = () => {
    onDelete(question.id);
    setShowDeleteDialog(false);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        {isEditing ? (
          <QuestionEditForm
            formData={formData}
            onFormChange={handleFormChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="p-4 space-y-4">
            <p><strong>Question:</strong> {formData.question_text}</p>
            {formData.article_url && (
              <p>
                <strong>URL de l'article:</strong>{" "}
                <a href={formData.article_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {formData.article_url}
                </a>
              </p>
            )}
            <div>
              <strong>Options:</strong>
              <ul className="list-disc pl-5 mt-2">
                {formData.options.map((option, idx) => (
                  <li key={idx} className={option === formData.correct_answer ? "text-green-600" : ""}>
                    {option} {option === formData.correct_answer && "(Réponse correcte)"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AccordionContent>

      <DeleteQuestionDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </AccordionItem>
  );
};

export default QuestionAccordion;