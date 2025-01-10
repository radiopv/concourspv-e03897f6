import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";

interface ArticleLinkProps {
  url: string;
  onArticleRead: () => void;
  isRead: boolean;
}

const ArticleLink = ({ url, onArticleRead, isRead }: ArticleLinkProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleArticleClick = () => {
    setCountdown(5);

    if (isMobile) {
      toast({
        title: "Lecture de l'article",
        description: "L'article va s'ouvrir dans un nouvel onglet. N'oubliez pas de revenir ici pour répondre à la question ! 📱",
        duration: 5000,
      });

      setTimeout(() => {
        window.open(url, '_blank');
        
        setTimeout(() => {
          toast({
            title: "Rappel",
            description: "Une fois votre lecture terminée, revenez sur cet onglet pour continuer le questionnaire ! 🎯",
            duration: 5000,
          });
        }, 6000);
      }, 1500);

    } else {
      const width = 800;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        url,
        'Article',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    }

    // Démarrer le décompte
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onArticleRead();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-2">
      {countdown !== null && (
        <div className="text-center text-2xl font-bold text-primary mb-4">
          {countdown}
        </div>
      )}
      <Button
        variant={isRead ? "outline" : "default"}
        className="w-full flex items-center justify-center gap-2"
        onClick={handleArticleClick}
        disabled={countdown !== null}
      >
        <BookOpen className="w-5 h-5" />
        {isRead ? "Relire l'article" : "Lire l'article"}
        {isMobile && <span className="text-xs">(nouvel onglet)</span>}
      </Button>
      {isMobile && !isRead && (
        <p className="text-sm text-muted-foreground text-center">
          L'article s'ouvrira dans un nouvel onglet. 
          N'oubliez pas de revenir ici après votre lecture !
        </p>
      )}
    </div>
  );
};

export default ArticleLink;