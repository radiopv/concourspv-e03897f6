import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";

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
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  return (
    <AccordionItem value={question.id} className="border rounded-lg mb-4 bg-white">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex items-center gap-4">
          <span className="font-bold">Question {index + 1}</span>
          <span className="text-sm text-gray-600">{formData.question_text}</span>
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
                />
                <Button
                  variant="outline"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    correct_answer: option
                  }))}
                  className={option === formData.correct_answer ? "bg-green-50" : ""}
                >
                  ✓
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onDelete(question.id)}>
              Supprimer
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordion;