import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface FacebookShareButtonProps {
  url: string;
  title: string;
  type: 'contest' | 'score' | 'general';
  contestId?: string;
  imageUrl?: string;
}

const FacebookShareButton = ({ url, title, type, contestId, imageUrl }: FacebookShareButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleShare = async () => {
    try {
      // Construire l'URL avec les paramètres pour le débogage Facebook
      const debugUrl = `${url}${url.includes('?') ? '&' : '?'}_fb_debug=true`;
      
      // Construire l'URL de partage Facebook
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(debugUrl)}`;
      
      // Ouvrir la fenêtre de partage Facebook
      const width = 626;
      const height = 436;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        fbShareUrl,
        'facebook-share-dialog',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (user) {
        // Gérer les points de partage
        const { data, error } = await supabase.rpc('handle_facebook_share', {
          input_user_id: user.id,
          share_type: type,
          contest_id: contestId
        });

        if (error) {
          console.error('Erreur lors du partage:', error);
          throw error;
        }

        // Afficher le message approprié selon le résultat
        if (data.points_awarded > 0) {
          const message = type === 'contest'
            ? "Vous avez gagné 5 points et une participation bonus !"
            : "Vous avez gagné 5 points pour votre partage !";

          toast({
            title: "Partage réussi !",
            description: message,
            duration: 5000,
          });
        } else {
          toast({
            title: "Partage réussi !",
            description: "Vous avez atteint la limite de partages récompensés pour ce mois-ci.",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="bg-[#1877F2] hover:bg-[#0C63D4] text-white"
      size="sm"
    >
      <Facebook className="w-4 h-4 mr-2" />
      Partager sur Facebook
    </Button>
  );
};

export default FacebookShareButton;