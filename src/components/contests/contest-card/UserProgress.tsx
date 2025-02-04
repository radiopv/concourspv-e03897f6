import { AlertCircle } from "lucide-react";

interface UserProgressProps {
  userParticipation: any;
  settings: any;
  remainingAttempts: number;
}

const UserProgress = ({ userParticipation, settings }: UserProgressProps) => {
  if (!userParticipation) return null;

  const isPerfectScore = userParticipation.score >= 80;
  const hasParticipated = userParticipation.status === 'completed';

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
            80%
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600">Statut</p>
          <p className={`text-lg font-bold ${isPerfectScore ? 'text-green-600' : 'text-red-600'}`}>
            {hasParticipated ? (isPerfectScore ? "Validé" : "Non validé") : "Non participé"}
          </p>
        </div>
      </div>
      {hasParticipated && (
        <div className={`${isPerfectScore ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-lg text-sm`}>
          {isPerfectScore 
            ? "Félicitations ! Vous avez validé ce concours." 
            : "Score insuffisant. Malheureusement, une seule participation est autorisée."}
        </div>
      )}
    </div>
  );
};

export default UserProgress;