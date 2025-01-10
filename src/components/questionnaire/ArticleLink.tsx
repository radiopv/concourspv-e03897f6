import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ArticleLinkProps {
  url: string;
  onArticleRead: () => void;
  isRead: boolean;
}

const ArticleLink = ({ url, onArticleRead, isRead }: ArticleLinkProps) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [readingTimer, setReadingTimer] = useState<number>(0);
  const READING_TIME = 5;

  useEffect(() => {
    setHasClicked(false);
    setReadingTimer(0);
  }, [url]);

  useEffect(() => {
    if (!hasClicked || readingTimer >= READING_TIME) {
      return;
    }

    const interval = setInterval(() => {
      setReadingTimer((prev) => {
        if (prev >= READING_TIME - 1) {
          clearInterval(interval);
          // Déplacer onArticleRead en dehors du setState
          setTimeout(onArticleRead, 0);
          return READING_TIME;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasClicked, readingTimer, onArticleRead]);

  const handleClick = () => {
    setHasClicked(true);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Important : L'article s'ouvrira dans un nouvel onglet. 
          Après votre lecture, revenez sur cet onglet pour répondre à la question.
        </AlertDescription>
      </Alert>

      <Button
        variant="outline"
        className={cn(
          "w-full flex items-center justify-center gap-2",
          isRead && "bg-green-50"
        )}
        onClick={handleClick}
        disabled={hasClicked && readingTimer < READING_TIME}
      >
        <ExternalLink className="w-4 h-4" />
        {hasClicked 
          ? readingTimer < READING_TIME 
            ? `Veuillez patienter ${READING_TIME - readingTimer} secondes...`
            : "Article consulté ✓"
          : "Cliquez ici pour lire l'article et afficher la question"}
      </Button>

      {hasClicked && readingTimer < READING_TIME && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            Une fois l'article ouvert, prenez le temps de le lire. 
            La question apparaîtra automatiquement dans quelques secondes.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ArticleLink;