import React from 'react';
import { Trophy } from 'lucide-react';

const ContestListHeader = () => {
  return (
    <div className="text-center mb-12 animate-fadeIn">
      <div className="flex items-center justify-center mb-4">
        <Trophy className="w-12 h-12 text-amber-500 mr-3" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
          Nos Concours
        </h1>
      </div>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Découvrez nos concours exceptionnels et leurs lots incroyables à gagner !
      </p>
    </div>
  );
};

export default ContestListHeader;