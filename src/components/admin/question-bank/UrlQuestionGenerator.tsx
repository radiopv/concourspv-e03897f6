import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const UrlQuestionGenerator = () => {
  const { toast } = useToast();
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddUrl = () => {
    if (urlInput && !urls.includes(urlInput)) {
      setUrls([...urls, urlInput]);
      setUrlInput("");
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  const handleBulkUrlsAdd = () => {
    const newUrls = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && !urls.includes(url));
    
    setUrls([...urls, ...newUrls]);
    setBulkUrls("");
  };

  const handleGenerate = async () => {
    if (urls.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une URL",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions
        .invoke('generate-questions-from-urls', {
          body: { urls },
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${data.questions.length} questions ont été générées et ajoutées à la banque de questions`,
      });

      // Clear URLs after successful generation
      setUrls([]);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer des questions à partir d'URLs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez une URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
          />
          <Button onClick={handleAddUrl}>Ajouter</Button>
        </div>

        <div>
          <Textarea
            placeholder="Collez plusieurs URLs (une par ligne)"
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleBulkUrlsAdd}
            className="mt-2"
            variant="outline"
          >
            Ajouter les URLs
          </Button>
        </div>

        {urls.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">URLs ajoutées :</h3>
            <ul className="space-y-2">
              {urls.map((url, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="truncate mr-2">{url}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveUrl(url)}
                  >
                    Supprimer
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || urls.length === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            'Générer les questions'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UrlQuestionGenerator;