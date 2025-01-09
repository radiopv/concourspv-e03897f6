import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface QuestionAccordionProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
  };
  onDelete: (id: string) => void;
}

const QuestionAccordion: React.FC<QuestionAccordionProps> = ({ question, onDelete }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id);

      if (error) throw error;

      onDelete(question.id);
      toast({
        title: "Succès",
        description: "La question a été supprimée",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger>
        <div className="flex justify-between items-center">
          <span>{question.question_text}</span>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div>
          <p>Options:</p>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          {question.article_url && (
            <p>
              <a href={question.article_url} target="_blank" rel="noopener noreferrer">
                Lien vers l'article
              </a>
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordion;
