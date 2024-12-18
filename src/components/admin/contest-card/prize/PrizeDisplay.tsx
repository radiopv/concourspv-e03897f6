import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from 'lucide-react';

interface PrizeDisplayProps {
  imageUrl?: string;
  shopUrl?: string;
  onRemove: () => void;
}

const PrizeDisplay = ({ imageUrl, shopUrl, onRemove }: PrizeDisplayProps) => {
  if (!imageUrl) return null;

  return (
    <div className="relative group">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Prix à gagner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <X className="w-4 h-4 mr-2" />
            Retirer
          </Button>
        </div>
      </div>
      {shopUrl && (
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le prix sur la boutique
        </a>
      )}
    </div>
  );
};

export default PrizeDisplay;