import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface FacebookShareButtonProps {
  url: string;
  title: string;
  type: 'contest' | 'score' | 'general';
  contestId?: string;
}

const FacebookShareButton = ({ url, title, type, contestId }: FacebookShareButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleShare = async () => {
    try {
      // Ouvrir la fenêtre de partage Facebook
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');

      if (user) {
        // Enregistrer le partage et attribuer les points
        const { error } = await supabase
          .from('point_history')
          .insert([
            {
              user_id: user.id,
              points: 5, // Points pour le partage
              source: `facebook_share_${type}`,
              contest_id: contestId
            }
          ]);

        if (error) throw error;

        // Mettre à jour les points de l'utilisateur
        const { error: updateError } = await supabase
          .rpc('increment_user_points', {
            user_id: user.id,
            points_to_add: 5
          });

        if (updateError) throw updateError;

        // Si c'est un partage de concours, ajouter une participation bonus
        if (type === 'contest' && contestId) {
          const { error: participationError } = await supabase
            .from('user_points')
            .update({ extra_participations: supabase.sql`extra_participations + 1` })
            .eq('user_id', user.id);

          if (participationError) throw participationError;
        }

        toast({
          title: "Partage réussi !",
          description: "Vous avez gagné 5 points et une participation bonus !",
          duration: 5000,
        });
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