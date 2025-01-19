import { Gift, ExternalLink } from "lucide-react";
import { Prize } from "@/types/prize";

interface ContestPrizesProps {
  prizes: Prize[];
}

const ContestPrizes = ({ prizes }: ContestPrizesProps) => {
  if (!prizes || prizes.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Gift className="w-5 h-5 text-purple-500" />
        Prix à gagner
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prizes.map((prize, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200">
            {prize.image_url && (
              <div className="aspect-video relative">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-3 bg-white/80 space-y-2">
              <p className="font-medium text-purple-700">{prize.name}</p>
              {prize.shop_url && (
                <a
                  href={prize.shop_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Voir le cadeau sur la boutique web
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPrizes;