import React from 'react';
import { ExternalLink, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ContestCardPrizeProps {
  prizeImageUrl?: string;
  shopUrl?: string;
  onEdit: () => void;
}

const ContestCardPrize = ({ prizeImageUrl, shopUrl, onEdit }: ContestCardPrizeProps) => {
  return (
    <div className="relative group">
      {prizeImageUrl ? (
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img
            src={prizeImageUrl}
            alt="Prix à gagner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="ghost" className="text-white" onClick={onEdit}>
              <Image className="w-4 h-4 mr-2" />
              Modifier l'image
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-32 mb-4" 
          onClick={onEdit}
        >
          <Image className="w-4 h-4 mr-2" />
          Ajouter une image du prix
        </Button>
      )}
      
      {shopUrl && (
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le prix sur la boutique
        </a>
      )}
    </div>
  );
};

export default ContestCardPrize;