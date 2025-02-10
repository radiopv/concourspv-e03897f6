
import { Gift, ExternalLink, DollarSign } from "lucide-react";
import { Prize } from "@/types/prize";

interface ContestPrizesProps {
  prizes: Prize[];
}

const ContestPrizes = ({ prizes }: ContestPrizesProps) => {
  if (!prizes || prizes.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 justify-center">
        <Gift className="w-5 h-5 text-[#F97316]" />
        Prix à gagner
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {prizes.map((prize) => (
          <div 
            key={prize.id} 
            className="group relative overflow-hidden rounded-lg border border-gray-200/20 bg-white/70 backdrop-blur-sm p-4"
          >
            <div className="flex items-center gap-4">
              {prize.image_url && (
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={prize.image_url}
                    alt={prize.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-800">
                  {prize.name}
                </h4>
                {prize.value && (
                  <p className="flex items-center gap-1 text-[#F97316] text-sm mt-1">
                    <DollarSign className="w-4 h-4" />
                    Valeur: {prize.value} CAD $
                  </p>
                )}
                {prize.shop_url && (
                  <a
                    href={prize.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#9b87f5] hover:text-[#F97316] transition-colors mt-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le cadeau
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizes;
