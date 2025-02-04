import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ArticleLinkProps {
  url: string;
  isRead: boolean;
  onArticleRead: () => void;
}

const ArticleLink: React.FC<ArticleLinkProps> = ({ url, isRead, onArticleRead }) => {
  const [showReturnAlert, setShowReturnAlert] = useState(false);

  const handleClick = () => {
    // Try to open in a new window first
    const newWindow = window.open(url, '_blank', 'width=800,height=600');
    
    // If popup was blocked or on mobile, fallback to new tab
    if (!newWindow) {
      window.open(url, '_blank');
    }
    
    // Mark as read and show return alert
    onArticleRead();
    setShowReturnAlert(true);
  };

  return (
    <div className="space-y-4">
      <Button
        variant={isRead ? "default" : "outline"}
        onClick={handleClick}
        className="w-full justify-between"
      >
        <span>Lire l'article</span>
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      {showReturnAlert && (
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/10">
          <ArrowLeft className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            Une fois l'article lu, revenez ici pour répondre à la question !
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ArticleLink;