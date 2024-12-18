import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Timer } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContestStatsProps {
  participantsCount: number;
  successPercentage: number;
  timeLeft: string;
  endDate: string;
}

const ContestStats = ({ participantsCount, successPercentage, timeLeft, endDate }: ContestStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Users className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle className="text-lg">Participants</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl font-bold text-gray-900">
            {participantsCount}
          </p>
          <p className="text-sm text-gray-600">inscrits</p>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CheckCircle className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle className="text-lg">Taux de réussite</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl font-bold text-gray-900">
            {successPercentage}%
          </p>
          <p className="text-sm text-gray-600">≥ 70% de bonnes réponses</p>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Timer className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle className="text-lg">Temps restant</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl font-bold text-gray-900">
            {timeLeft}
          </p>
          <p className="text-sm text-gray-600">
            Fin le {format(new Date(endDate), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestStats;