import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface QuestionFormProps {
  question: {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    article_url?: string;
    image_url?: string;
  };
  onSave: (question: any) => void;
  onCancel: () => void;
}

const QuestionForm = ({ question, onSave, onCancel }: QuestionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    question_text: question.question_text,
    options: [...question.options],
    correct_answer: question.correct_answer,
    article_url: question.article_url || '',
    image_url: question.image_url || '',
  });

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('questions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('questions')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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
        />
      </div>

      <div>
        <Label>Lien de l'article</Label>
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
        <Label>Image de la question</Label>
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
          <Button variant="outline" className="flex items-center gap-2">
            <ImagePlus className="w-4 h-4" />
            Modifier l'image
          </Button>
        </div>
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Question"
            className="mt-2 rounded-lg max-h-48 object-cover"
          />
        )}
      </div>

      {formData.options.map((option, optionIndex) => (
        <div key={optionIndex}>
          <Label>Option {optionIndex + 1}</Label>
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
        </div>
      ))}

      <div>
        <Label>Réponse correcte</Label>
        <Input
          value={formData.correct_answer}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            correct_answer: e.target.value
          }))}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4" /> Annuler
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;