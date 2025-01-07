import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { validateLinks } from "./validators/LinkValidator";
import { validateContentQuality } from "./validators/ContentQualityValidator";
import { ValidationResultDisplay } from "./validators/ValidationResultDisplay";

export const checkUrl = async (url: string): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const response = await fetch(url, { 
      mode: 'no-cors',
      method: 'HEAD'
    });
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const ContentValidator = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateContent = async () => {
    setIsValidating(true);
    setResults([]);
    
    try {
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

      let allResults = [];

      // Validate each contest
      for (const contest of contests || []) {
        // Content quality validation
        const contentResults = validateContentQuality(contest);
        allResults.push(...contentResults);

        // Link validation for questions
        const linksToCheck = contest.questions
          ?.filter(q => q.article_url)
          .map(q => ({
            url: q.article_url!,
            details: `Question ID: ${q.id}`
          })) || [];

        const linkResults = await validateLinks(linksToCheck);
        allResults.push(...linkResults);
      }

      setResults(allResults);
      toast({
        title: "Validation terminée",
        description: `${allResults.length} éléments analysés`,
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
            <ValidationResultDisplay results={results} />
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