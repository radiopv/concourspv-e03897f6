import React from 'react';
import { motion } from 'framer-motion';
import ContestCard from '../ContestCard';

interface ContestListGridProps {
  contests: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
    draw_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    shop_url?: string;
    prize_image_url?: string;
    participants?: { count: number };
    questions?: { count: number };
  }>;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onFeatureToggle: (id: string, featured: boolean) => void;
  onStatusUpdate: (id: string, updates: { is_new?: boolean; has_big_prizes?: boolean; status?: string }) => void;
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
      {contests.map((contest, index) => (
        <motion.div
          key={contest.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full"
        >
          <ContestCard
            contest={contest}
            onDelete={onDelete}
            onArchive={onArchive}
            onFeatureToggle={onFeatureToggle}
            onStatusUpdate={onStatusUpdate}
            onSelect={onSelect}
            onEdit={onEdit}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ContestListGrid;