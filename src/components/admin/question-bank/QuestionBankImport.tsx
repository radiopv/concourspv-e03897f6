import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const QuestionBankImport = () => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      toast({
        title: "Succès",
        description: data.message,
      });

      // Reset form
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
  );
};

export default QuestionBankImport;