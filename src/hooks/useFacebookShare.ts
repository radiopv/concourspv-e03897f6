import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ShareResult {
  points_awarded: number;
  total_shares_this_month: number;
  bonus_awarded: number;
  extra_participation_added: number;
  message: string;
}

export const useFacebookShare = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const shareToFacebook = async (
    url: string,
    type: 'contest' | 'score' | 'general',
    contestId?: string
  ) => {
    try {
      // Ajouter le paramètre de débogage
      const debugUrl = `${url}${url.includes('?') ? '&' : '?'}_fb_debug=true`;
      
      // Construire l'URL de partage Facebook
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(debugUrl)}`;
      
      // Ouvrir la fenêtre de partage
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

        const result = data as ShareResult;Je vais refactoriser le code pour améliorer la gestion du partage Facebook et la structure des composants. Voici les changements proposés :

<lov-code>
Je vais créer plusieurs nouveaux fichiers pour mieux organiser le code :

1. D'abord, créons un hook personnalisé pour gérer la logique de partage :

<lov-write file_path="src/hooks/useFacebookShare.ts">
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ShareResult {
  points_awarded: number;
  total_shares_this_month: number;
  bonus_awarded: number;
  extra_participation_added: number;
  message: string;
}

export const useFacebookShare = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const shareToFacebook = async (
    url: string,
    type: 'contest' | 'score' | 'general',
    contestId?: string
  ) => {
    try {
      // Ajouter le paramètre de débogage
      const debugUrl = `${url}${url.includes('?') ? '&' : '?'}_fb_debug=true`;
      
      // Construire l'URL de partage Facebook
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(debugUrl)}`;
      
      // Ouvrir la fenêtre de partage
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
        const { data, error } = await supabase.rpc('handle_facebook_share', {
          input_user_id: user.id,
          share_type: type,
          contest_id: contestId
        });

        if (error) {
          console.error('Erreur lors du partage:', error);
          throw error;
        }

        const result = data as ShareResult;
        
        if (result.points_awarded > 0) {
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

        return result;
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

  return { shareToFacebook };
};