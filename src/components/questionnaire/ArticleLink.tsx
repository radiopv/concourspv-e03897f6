import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export interface ArticleLinkProps {
  url: string;
  isRead: boolean;
  onArticleRead: () => void;
}

const ArticleLink: React.FC<ArticleLinkProps> = ({ url, isRead, onArticleRead }) => {
  const handleClick = () => {
    window.open(url, '_blank');
    onArticleRead();
  };

  return (
    <Button
      variant={isRead ? "default" : "outline"}
      onClick={handleClick}
      className="w-full justify-between"
    >
      <span>Lire l'article</span>
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default ArticleLink;