import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateUrlQuestionProps {
  contestId?: string;
}

const CreateUrlQuestion: React.FC<CreateUrlQuestionProps> = ({ contestId }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-questions-from-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: [url],
          contestId: contestId // Maintenant optionnel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Questions générées",
          description: data.message,
        });
        
        // Refresh questions list
        if (contestId) {
          queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['question-bank'] });
        }
        setUrl('');
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="Entrez l'URL de l'article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Génération...' : 'Générer des questions'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateUrlQuestion;