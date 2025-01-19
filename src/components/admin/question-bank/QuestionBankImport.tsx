import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';

const QuestionBankImport = () => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer au moins une URL valide",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-questions-ollama', {
        body: { urls: validUrls }
      });

      if (error) throw error;

      setGeneratedQuestions(data.questions || []);
      
      toast({
        title: "Succès",
        description: data.message,
      });

      // Refresh the questions list
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });

      // Reset form only on success
      setUrls(['']);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions. Vérifiez qu'Ollama est bien lancé.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importer des questions depuis des URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="https://..."
                  disabled={isLoading}
                />
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeUrlField(index)}
                    disabled={isLoading}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={addUrlField}
                disabled={isLoading}
              >
                Ajouter une URL
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer les questions'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions générées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{question.question_text}</h3>
                  <div className="space-y-1">
                    {question.options.map((option: string, optIndex: number) => (
                      <p 
                        key={optIndex}
                        className={option === question.correct_answer ? "text-green-600 font-medium" : ""}
                      >
                        {option}
                      </p>
                    ))}
                  </div>
                  {question.article_url && (
                    <a 
                      href={question.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 block"
                    >
                      Lien vers l'article
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionBankImport;