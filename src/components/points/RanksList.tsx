import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANKS } from "@/services/pointsService";

const RanksList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Niveaux et Avantages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RANKS.map((rank) => (
            <Card key={rank.rank} className="bg-white/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{rank.badge}</span>
                  <h3 className="text-lg font-semibold">{rank.rank}</h3>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {rank.minPoints} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints} points
                </div>
                <ul className="space-y-2 text-sm">
                  {rank.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksList;