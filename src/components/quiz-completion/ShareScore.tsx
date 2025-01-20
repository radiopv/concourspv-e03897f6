import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import FacebookShareButton from '../social/FacebookShareButton';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ShareScoreProps {
  score: number;
  contestTitle: string;
  contestId: string;
}

const ShareScore = ({ score, contestTitle, contestId }: ShareScoreProps) => {
  const shareUrl = `${window.location.origin}/contests/${contestId}`;
  const shareTitle = `Je viens d'obtenir ${score}% au concours "${contestTitle}" ! Participez vous aussi pour gagner des prix exceptionnels !`;

  // Fetch contest metadata for OG tags
  const { data: metadata } = useQuery({
    queryKey: ['contest-metadata', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_contest_share_metadata', {
          input_contest_id: contestId
        });

      if (error) {
        console.error('Error fetching contest metadata:', error);
        throw error;
      }
      return data?.[0];
    }
  });

  console.log('Contest metadata for sharing:', metadata); // Debug log

  return (
    <>
      <Helmet>
        <meta property="og:title" content={`${score}% - ${contestTitle}`} />
        <meta property="og:description" content={shareTitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {metadata?.image_url && (
          <>
            <meta property="og:image" content={metadata.image_url} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
        <meta property="og:site_name" content="Concours Quiz" />
        {metadata?.prize_value && (
          <>
            <meta property="og:price:amount" content={metadata.prize_value.toString()} />
            <meta property="og:price:currency" content="CAD" />
          </>
        )}
        <meta property="fb:app_id" content="1103960937264123" />
      </Helmet>
      
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            Partagez votre score !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Partagez votre score avec vos amis et gagnez 5 points bonus !
          </p>
          <div className="flex justify-center">
            <FacebookShareButton
              url={shareUrl}
              title={shareTitle}
              type="score"
              contestId={contestId}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ShareScore;