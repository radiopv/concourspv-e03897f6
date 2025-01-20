import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useFacebookShare } from "@/hooks/useFacebookShare";

interface FacebookShareButtonProps {
  url: string;
  title: string;
  type: 'contest' | 'score' | 'general';
  contestId?: string;
  imageUrl?: string;
}

const FacebookShareButton = ({ url, type, contestId }: FacebookShareButtonProps) => {
  const { shareToFacebook } = useFacebookShare();

  const handleShare = () => {
    shareToFacebook(url, type, contestId);
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