import React from 'react';
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

  const handleArticleClick = () => {
    if (isMobile) {
      // Sur mobile, d'abord afficher le toast
      toast({
        title: "Lecture de l'article",
        description: "L'article va s'ouvrir dans un nouvel onglet. N'oubliez pas de revenir ici pour répondre à la question ! 📱",
        duration: 5000,
      });

      // Attendre un court instant pour que l'utilisateur puisse lire le message
      setTimeout(() => {
        // Ouvrir l'article dans un nouvel onglet
        window.open(url, '_blank');
        
        // Afficher un deuxième toast après quelques secondes
        setTimeout(() => {
          toast({
            title: "Rappel",
            description: "Une fois votre lecture terminée, revenez sur cet onglet pour continuer le questionnaire ! 🎯",
            duration: 5000,
          });
        }, 6000);
      }, 1500);

      // Attendre 5 secondes avant d'activer l'affichage des réponses
      setTimeout(() => {
        onArticleRead();
      }, 5000);
    } else {
      // Sur desktop, ouvrir dans une popup
      const width = 800;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        url,
        'Article',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // Attendre 5 secondes avant d'activer l'affichage des réponses
      setTimeout(() => {
        onArticleRead();
        toast({
          title: "Question déverrouillée",
          description: "Vous pouvez maintenant répondre à la question ! 🎯",
          duration: 3000,
        });
      }, 5000);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant={isRead ? "outline" : "default"}
        className="w-full flex items-center justify-center gap-2"
        onClick={handleArticleClick}
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