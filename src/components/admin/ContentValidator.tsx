import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Clock, FileText, Link2 } from "lucide-react";
import { supabase } from "../../App";

interface ValidationResult {
  url: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  type: 'link' | 'content' | 'seo';
  details?: string;
}

const ContentValidator = () => {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateContent = async () => {
    setIsValidating(true);
    setResults([]);
    
    try {
      // Récupérer tous les concours et leurs questions
      const { data: contests, error: contestsError } = await supabase
        .from('contests')
        .select(`
          id,
          title,
          description,
          questions (
            id,
            question_text,
            article_url
          )
        `);

      if (contestsError) throw contestsError;

      const newResults: ValidationResult[] = [];

      // Vérifier chaque concours
      for (const contest of contests || []) {
        // Vérifier le contenu du concours
        if (!contest.title || contest.title.length < 5) {
          newResults.push({
            url: `/contests/${contest.id}`,
            status: 'warning',
            message: "Titre du concours trop court",
            type: 'content'
          });
        }

        if (!contest.description || contest.description.length < 50) {
          newResults.push({
            url: `/contests/${contest.id}`,
            status: 'warning',
            message: "Description du concours insuffisante",
            type: 'content'
          });
        }

        // Vérifier les questions et leurs liens
        for (const question of contest.questions || []) {
          if (question.article_url) {
            try {
              const response = await fetch(question.article_url);
              if (!response.ok) {
                newResults.push({
                  url: question.article_url,
                  status: 'error',
                  message: `Lien mort (${response.status})`,
                  type: 'link',
                  details: `Question ID: ${question.id}`
                });
              } else {
                newResults.push({
                  url: question.article_url,
                  status: 'success',
                  message: "Lien valide",
                  type: 'link',
                  details: `Question ID: ${question.id}`
                });
              }
            } catch (error) {
              newResults.push({
                url: question.article_url,
                status: 'error',
                message: "Erreur lors de la vérification du lien",
                type: 'link',
                details: `Question ID: ${question.id}`
              });
            }
          } else {
            newResults.push({
              url: `/questions/${question.id}`,
              status: 'warning',
              message: "Question sans lien d'article",
              type: 'content',
              details: `Question ID: ${question.id}`
            });
          }
        }
      }

      setResults(newResults);
      toast({
        title: "Validation terminée",
        description: `${newResults.length} éléments analysés`,
      });
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'link':
        return <Link2 className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'seo':
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Validation du contenu</span>
          <Button 
            onClick={validateContent} 
            disabled={isValidating}
          >
            {isValidating ? "Validation en cours..." : "Lancer la validation"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(result.type)}
                        {result.type}
                      </Badge>
                      <span className="text-sm font-medium">{result.message}</span>
                    </div>
                    <p className="text-sm text-gray-500 break-all">{result.url}</p>
                    {result.details && (
                      <p className="text-sm text-gray-400 mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {isValidating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p>Validation en cours...</p>
                </div>
              ) : (
                "Lancez la validation pour voir les résultats"
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ContentValidator;