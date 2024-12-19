import { useState } from 'react';
import ContestCard from '@/components/contests/ContestCard';
import { useContests } from '@/hooks/useContests';

const ContestsList = () => {
  const [selectedContest, setSelectedContest] = useState<string>('');
  const { data: contests, isLoading } = useContests();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contests?.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onSelect={setSelectedContest}
        />
      ))}
    </div>
  );
};

export default ContestsList;