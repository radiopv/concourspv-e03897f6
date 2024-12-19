import React from 'react';
import ContestCard from '../ContestCard';

type ContestStatus = 'draft' | 'active' | 'archived';

interface ContestListGridProps {
  contests: Array<{
    id: string;
    title: string;
    description?: string;
    status: ContestStatus;
    start_date: string;
    end_date: string;
    draw_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
    questions?: { count: number };
  }>;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContestListGrid = ({
  contests,
  onSelect,
  onEdit
}: ContestListGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest, index) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onSelect={onSelect}
          index={index}
        />
      ))}
    </div>
  );
};

export default ContestListGrid;