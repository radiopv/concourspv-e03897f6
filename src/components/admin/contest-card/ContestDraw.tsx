
import React from 'react';
import { ContestStatus } from '@/types/contest';

interface ContestDrawProps {
  contestId: string;
  drawDate: string;
  status: ContestStatus;
}

const ContestDraw = ({ contestId, drawDate, status }: ContestDrawProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Tirage au sort</h3>
      <p>Date prévue : {new Date(drawDate).toLocaleDateString()}</p>
      {status === 'active' && (
        <p className="text-green-600">Le tirage au sort est prévu</p>
      )}
      {status === 'archived' && (
        <p className="text-gray-600">Le tirage au sort est terminé</p>
      )}
    </div>
  );
};

export default ContestDraw;
