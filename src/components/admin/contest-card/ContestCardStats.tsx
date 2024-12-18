import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContestCardStatsProps {
  participantsCount: number;
  questionsCount: number;
  endDate: string;
}

const ContestCardStats = ({ participantsCount, questionsCount, endDate }: ContestCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
      <div>
        <p className="font-medium">Participants</p>
        <p>{participantsCount}</p>
      </div>
      <div>
        <p className="font-medium">Questions</p>
        <p>{questionsCount}</p>
      </div>
      <div className="col-span-2">
        <p className="font-medium">Date de fin</p>
        <p>{format(new Date(endDate), 'dd MMMM yyyy', { locale: fr })}</p>
      </div>
    </div>
  );
};

export default ContestCardStats;