import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from '@/utils/imageUpload';
import { useToast } from "@/hooks/use-toast";

interface QuestionFormProps {
  initialData?: {
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    image_url?: string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const QuestionForm = ({ initialData, onSubmit, onCancel }: QuestionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    question_text: initialData?.question_text || "",
    options: initialData?.options || ["", "", "", ""],
    correct_answer: initialData?.correct_answer || "",
    article_url: initialData?.article_url || "",
    image_url: initialData?.image_url || "",
  });

  const handleImageChange = async (file: File) => {
    try {
      const imageUrl = await handleImageUpload(file);
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={formData.question_text}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            question_text: e.target.value
          }))}
          placeholder="Entrez votre question"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {formData.options.map((option, index) => (
          <Input
            key={index}
            value={option}
            onChange={(e) => {
              const newOptions = [...formData.options];
              newOptions[index] = e.target.value;
              setFormData(prev => ({
                ...prev,
                options: newOptions
              }));
            }}
            placeholder={`Option ${index + 1}`}
          />
        ))}
      </div>

      <div>
        <Label>Réponse correcte</Label>
        <Input
          value={formData.correct_answer}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            correct_answer: e.target.value
          }))}
          placeholder="Entrez la réponse correcte"
        />
      </div>

      <div>
        <Label>Lien de l'article (optionnel)</Label>
        <Input
          value={formData.article_url}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            article_url: e.target.value
          }))}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label>Image de la question (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageChange(file);
            }
          }}
        />
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Question"
            className="mt-2 max-h-40 rounded-lg"
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSubmit(formData)}>
          Enregistrer
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;