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
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { 
    is_new?: boolean; 
    has_big_prizes?: boolean; 
    status?: ContestStatus 
  }) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContestListGrid = ({
  contests,
  onDelete,
  onArchive,
  onFeatureToggle,
  onStatusUpdate,
  onSelect,
  onEdit
}: ContestListGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onDelete={onDelete}
          onArchive={onArchive}
          onFeatureToggle={onFeatureToggle}
          onStatusUpdate={onStatusUpdate}
          onSelect={onSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ContestListGrid;