import { Gift, ExternalLink } from "lucide-react";

interface ContestPrizesProps {
  prizes: any[];
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
        {prizes.map((prize: any, idx: number) => (
          prize.prize_catalog && (
            <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200">
              {prize.prize_catalog.image_url && (
                <div className="aspect-video relative">
                  <img
                    src={prize.prize_catalog.image_url}
                    alt={prize.prize_catalog.name}
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                  />
                  {prize.prize_catalog.shop_url && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={prize.prize_catalog.shop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir sur la boutique
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 bg-white/80">
                <p className="font-medium text-purple-700">{prize.prize_catalog.name}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ContestPrizes;