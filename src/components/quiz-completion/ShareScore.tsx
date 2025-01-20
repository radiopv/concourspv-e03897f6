import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface ShareScoreProps {
  score: number;
  totalQuestions: number;
  contestId: string;
}

const ShareScore = ({ score, totalQuestions, contestId }: ShareScoreProps) => {
  const { toast } = useToast();
  const currentUrl = window.location.href;

  const { data: metadata } = useQuery({
    queryKey: ['contest-share-metadata', contestId],
    queryFn: async () => {
      console.log('Fetching contest metadata for sharing...');
      const { data, error } = await supabase.rpc('get_contest_share_metadata', {
        input_contest_id: contestId
      });

      if (error) {
        console.error('Error fetching contest metadata:', error);
        throw error;
      }

      console.log('Contest metadata received:', data);
      return data[0];
    }
  });

  const handleShare = async () => {
    try {
      // Construct share URL with metadata
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      
      // Open Facebook share dialog
      const width = 626;
      const height = 436;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        shareUrl,
        'facebook-share-dialog',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      toast({
        title: "Partage réussi !",
        description: "Merci d'avoir partagé votre score !",
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive",
      });
    }
  };

  const shareTitle = metadata?.title 
    ? `J'ai obtenu ${score}/${totalQuestions} au quiz "${metadata.title}" !`
    : `J'ai obtenu ${score}/${totalQuestions} au quiz !`;

  const shareDescription = metadata?.description || 
    "Participez vous aussi et tentez de gagner des prix exceptionnels !";

  const shareImage = metadata?.image_url || 'https://votre-site.com/default-share-image.jpg';

  return (
    <>
      <Helmet>
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="fb:app_id" content="your-fb-app-id" />
        {metadata?.prize_value && (
          <meta property="og:price:amount" content={metadata.prize_value.toString()} />
        )}
        <meta property="og:price:currency" content="CAD" />
      </Helmet>

      <Button 
        onClick={handleShare}
        className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
      >
        <Facebook className="w-5 h-5 mr-2" />
        Partager sur Facebook
      </Button>
    </>
  );
};

export default ShareScore;