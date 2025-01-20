import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import FacebookShareButton from '../social/FacebookShareButton';

interface ShareScoreProps {
  score: number;
  contestTitle: string;
  contestId: string;
}

const ShareScore = ({ score, contestTitle, contestId }: ShareScoreProps) => {
  const shareUrl = `${window.location.origin}/contests/${contestId}`;
  const shareTitle = `Je viens d'obtenir ${score}% au concours "${contestTitle}" ! Participez vous aussi pour gagner des prix exceptionnels !`;

  return (
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
  );
};

export default ShareScore;