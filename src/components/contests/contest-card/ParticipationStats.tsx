import React from 'react';

export interface ParticipationStatsProps {
  participantsCount: number;
  questionsCount: number;
}

const ParticipationStats = ({ participantsCount, questionsCount }: ParticipationStatsProps) => {
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
    </div>
  );
};

export default ParticipationStats;