import { AlertCircle } from "lucide-react";

interface UserProgressProps {
  userParticipation: any;
  settings: any;
  remainingAttempts: number;
}

const UserProgress = ({ userParticipation, settings, remainingAttempts }: UserProgressProps) => {
  if (!userParticipation) return null;

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
            {remainingAttempts}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;