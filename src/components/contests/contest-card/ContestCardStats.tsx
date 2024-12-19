import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, HelpCircle, Calendar } from 'lucide-react';

interface ContestCardStatsProps {
  participantsCount: number;
  questionsCount: number;
  endDate: string;
}

const ContestCardStats = ({
  participantsCount,
  questionsCount,
  endDate,
}: ContestCardStatsProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4" />
        <span>{participantsCount} participants</span>
      </div>
      <div className="flex items-center space-x-1">
        <HelpCircle className="w-4 h-4" />
        <span>{questionsCount} questions</span>
      </div>
      <div className="flex items-center space-x-1">
        <Calendar className="w-4 h-4" />
        <span>Fin le {format(new Date(endDate), 'dd MMM yyyy', { locale: fr })}</span>
      </div>
    </div>
  );
};

export default ContestCardStats;