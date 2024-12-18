import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleLinkProps {
  url: string;
  onArticleRead: () => void;
  isRead: boolean;
}

const ArticleLink = ({ url, onArticleRead, isRead }: ArticleLinkProps) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [readingTimer, setReadingTimer] = useState<number>(0);
  const READING_TIME = 5; // 5 seconds minimum reading time

  useEffect(() => {
    setHasClicked(false);
    setReadingTimer(0);
  }, [url]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasClicked && readingTimer < READING_TIME) {
      interval = setInterval(() => {
        setReadingTimer(prev => {
          if (prev >= READING_TIME - 1) {
            onArticleRead();
            return READING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasClicked, readingTimer, onArticleRead]);

  const handleClick = () => {
    setHasClicked(true);
    window.open(url, '_blank');
  };

  return (
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
        : "Lire l'article pour afficher la question complète"}
    </Button>
  );
};

export default ArticleLink;