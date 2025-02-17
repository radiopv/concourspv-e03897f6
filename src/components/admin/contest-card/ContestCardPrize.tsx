
import React from 'react';
import { Prize } from '@/types/contest';

interface ContestCardPrizeProps {
  contestId: string;
  prizes: Prize[];
}

const ContestCardPrize = ({ contestId, prizes }: ContestCardPrizeProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prix à gagner</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes.map((prize) => (
          <div key={prize.id} className="p-4 border rounded-lg">
            {prize.image_url && (
              <img 
                src={prize.image_url} 
                alt={prize.name}
                className="w-full h-32 object-contain mb-2" 
              />
            )}
            <h4 className="font-medium">{prize.name}</h4>
            {prize.description && (
              <p className="text-sm text-gray-600">{prize.description}</p>
            )}
            {prize.value && (
              <p className="text-sm font-semibold text-green-600">
                Valeur: {prize.value}€
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestCardPrize;
