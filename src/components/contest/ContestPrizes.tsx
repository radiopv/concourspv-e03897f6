import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Prize {
  prize_catalog: {
    id: string;
    name: string;
    image_url?: string;
    shop_url?: string;
    value?: number;
    description?: string;
  };
}

interface ContestPrizesProps {
  prizes?: Prize[];
  isLoading?: boolean;
}

const ContestPrizes = ({ prizes, isLoading }: ContestPrizesProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle>Prix à gagner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prizes || prizes.length === 0) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle>Prix à gagner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Aucun prix n'est disponible pour ce concours pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
        <CardTitle>Prix à gagner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prizes.map((prize, index) => (
            <div
              key={prize.prize_catalog.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {prize.prize_catalog.image_url && (
                <div className="aspect-video relative">
                  <img
                    src={prize.prize_catalog.image_url}
                    alt={prize.prize_catalog.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-purple-700">
                  {prize.prize_catalog.name}
                </h3>
                {prize.prize_catalog.description && (
                  <p className="text-sm text-gray-600">
                    {prize.prize_catalog.description}
                  </p>
                )}
                {prize.prize_catalog.value && (
                  <p className="text-sm font-medium text-purple-600">
                    Valeur: {prize.prize_catalog.value}€
                  </p>
                )}
                {prize.prize_catalog.shop_url && (
                  <a
                    href={prize.prize_catalog.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Voir le cadeau
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestPrizes;