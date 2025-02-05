import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArticleLinkProps {
  url: string;
  isRead: boolean;
  onArticleRead: () => void;
}

const ArticleLink: React.FC<ArticleLinkProps> = ({ url, isRead, onArticleRead }) => {
  const [showReturnAlert, setShowReturnAlert] = useState(false);

  const handleClick = () => {
    const newWindow = window.open(url, '_blank', 'width=800,height=600');
    if (!newWindow) {
      window.open(url, '_blank');
    }
    onArticleRead();
    setShowReturnAlert(true);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isRead ? 1 : [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: isRead ? 0 : Infinity, ease: "easeInOut" }}
      >
        <Button
          variant={isRead ? "default" : "default"}
          onClick={handleClick}
          className={cn(
            "w-full justify-between py-6 text-lg font-semibold",
            "bg-gradient-to-r from-amber-500 to-orange-500",
            "hover:from-amber-600 hover:to-orange-600",
            "text-white shadow-lg hover:shadow-xl transition-all duration-300",
            "border-2 border-amber-400 hover:border-amber-500",
            !isRead && "animate-pulse"
          )}
          style={{
            animationDuration: '3s',
            animationTimingFunction: 'ease-in-out'
          }}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <span>Lire l'article</span>
          </div>
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </motion.div>

      {!isRead && (
        <Alert className="bg-amber-50 border-amber-200">
          <ExternalLink className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-600 font-medium">
            Vous devez lire l'article avant de pouvoir répondre !
          </AlertDescription>
        </Alert>
      )}

      {showReturnAlert && (
        <Alert className="bg-blue-50 border-blue-200">
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600 font-medium">
            Une fois l'article lu, revenez ici pour répondre à la question !
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ArticleLink;