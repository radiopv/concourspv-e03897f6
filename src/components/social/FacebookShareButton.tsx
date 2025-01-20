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
  imageUrl?: string;
}

const FacebookShareButton = ({ url, title, type, contestId, imageUrl }: FacebookShareButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleShare = async () => {
    try {
      // Get contest metadata if sharing a contest
      let shareUrl = url;
      let shareTitle = title;
      
      if (type === 'contest' && contestId) {
        const { data, error } = await supabase.rpc('get_contest_share_metadata', {
          contest_id: contestId
        });

        if (!error && data && data.length > 0) {
          const metadata = data[0];
          shareTitle = metadata.title;
          if (metadata.image_url) {
            shareUrl = `${url}?image=${encodeURIComponent(metadata.image_url)}`;
          }
        }
      }

      // Construct Facebook share URL with OG metadata
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
      
      // Open Facebook share dialog
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
        // Call the RPC function to handle rewards
        const { data, error } = await supabase.rpc('handle_facebook_share', {
          user_id: user.id,
          share_type: type,
          contest_id: contestId
        });

        if (error) throw error;

        // Show appropriate toast message based on the result
        const message = type === 'contest'
          ? "Vous avez gagné 5 points et une participation bonus !"
          : "Vous avez gagné 5 points pour votre partage !";

        // If monthly bonus was awarded, add it to the message
        const bonusMessage = data.bonus_awarded > 0
          ? "\n+15 points bonus pour 5 partages ce mois-ci !"
          : "";

        toast({
          title: "Partage réussi !",
          description: message + bonusMessage,
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