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
    <div className="relative group border rounded-lg p-2">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Prix à gagner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Retirer
          </Button>
          {shopUrl && (
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Voir
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeDisplay;