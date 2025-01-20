import { Card } from "@/components/ui/card";
import RanksList from "@/components/points/RanksList";
import CommunityStats from "@/components/points/CommunityStats";
import ExtraParticipations from "@/components/points/ExtraParticipations";

const Points = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Système de Points</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Rangs et Avantages</h2>
          <RanksList />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Statistiques de la Communauté</h2>
          <CommunityStats />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Participations Bonus</h2>
        <ExtraParticipations />
      </Card>
    </div>
  );
};

export default Points;