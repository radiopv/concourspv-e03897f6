import { AlertCircle, Star, Gift } from "lucide-react";

interface UserProgressProps {
  userParticipation: any;
  settings: any;
  remainingAttempts: number;
}

const UserProgress = ({ userParticipation, settings, remainingAttempts }: UserProgressProps) => {
  if (!userParticipation) return null;

  const points = userParticipation.points || 0;
  const bonusAttempts = userParticipation.bonus_attempts || 0;
  const nextMilestone = points < 25 ? 25 : points < 50 ? 50 : points < 100 ? 100 : Math.ceil(points / 25) * 25;
  const nextBonus = points < 25 ? 1 : points < 50 ? 2 : points < 100 ? 4 : 2;

  return (
    <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
        <AlertCircle className="w-5 h-5 text-blue-500" />
        Votre progression
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600">Score requis</p>
          <p className="text-lg font-bold text-blue-600">
            {settings?.required_percentage || 70}%
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600">Tentatives restantes</p>
          <p className={`text-lg font-bold ${remainingAttempts > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remainingAttempts + bonusAttempts}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Points gagnés
          </p>
          <p className="text-lg font-bold text-yellow-600">{points}</p>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Gift className="w-4 h-4 text-purple-500" />
            Prochain bonus
          </p>
          <p className="text-lg font-bold text-purple-600">
            {nextMilestone} pts = +{nextBonus} participations
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;