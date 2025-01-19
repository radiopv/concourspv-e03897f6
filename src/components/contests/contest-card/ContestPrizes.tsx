import { Gift, ExternalLink, DollarSign } from "lucide-react";
import { Prize } from "@/types/prize";

interface ContestPrizesProps {
  prizes: Prize[];
}

const ContestPrizes = ({ prizes }: ContestPrizesProps) => {
  if (!prizes || prizes.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-[#F97316]">
        <Gift className="w-5 h-5" />
        Prix à gagner
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize, idx) => (
          <div 
            key={idx} 
            className="group relative overflow-hidden rounded-lg border border-[#9b87f5]/20 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            {prize.image_url && (
              <div className="aspect-video relative">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-lg text-[#9b87f5] text-center">
                {prize.name}
              </h4>
              {prize.value && (
                <p className="flex items-center justify-center gap-1 text-[#F97316] font-medium">
                  <DollarSign className="w-4 h-4" />
                  Valeur: {prize.value}€
                </p>
              )}
              {prize.description && (
                <p className="text-sm text-gray-300 text-center line-clamp-2">
                  {prize.description}
                </p>
              )}
              {prize.shop_url && (
                <div className="text-center">
                  <a
                    href={prize.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-sm text-[#9b87f5] hover:text-[#F97316] transition-colors bg-black/20 px-4 py-2 rounded-full hover:bg-black/40"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le cadeau
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizes;