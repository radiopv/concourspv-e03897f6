import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleLinkProps {
  url: string;
  onArticleRead: () => void;
}

const READING_TIME = 5;

const ArticleLink: React.FC<ArticleLinkProps> = ({ url, onArticleRead }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [readingTimer, setReadingTimer] = useState(0);

  useEffect(() => {
    if (!hasClicked || readingTimer >= READING_TIME) return;

    const timer = setInterval(() => {
      setReadingTimer(prev => {
        const newValue = prev + 1;
        if (newValue >= READING_TIME) {
          clearInterval(timer);
          onArticleRead();
          return READING_TIME;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasClicked, readingTimer, onArticleRead]);

  const handleClick = () => {
    setHasClicked(true);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-blue-700">
            Lisez l'article avant de répondre à la question
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-blue-600 border-blue-200",
                hasClicked && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleClick}
              disabled={hasClicked}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {hasClicked ? "Article ouvert" : "Lire l'article"}
            </Button>
            {hasClicked && (
              <span className="text-sm text-blue-600">
                {readingTimer >= READING_TIME
                  ? "Temps de lecture écoulé"
                  : `${READING_TIME - readingTimer}s`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleLink;