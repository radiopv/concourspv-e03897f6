import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from '@/types/database';

interface QuestionStatsProps {
  questions: Question[] | undefined;
}

const QuestionStats = ({ questions }: QuestionStatsProps) => {
  const stats = {
    available: questions?.filter(q => q.status === 'available').length || 0,
    in_use: questions?.filter(q => q.status === 'in_use').length || 0,
    archived: questions?.filter(q => q.status === 'archived').length || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Questions disponibles</h3>
          <Badge variant="secondary">{stats.available}</Badge>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Questions en utilisation</h3>
          <Badge variant="secondary">{stats.in_use}</Badge>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Questions archivées</h3>
          <Badge variant="secondary">{stats.archived}</Badge>
        </div>
      </Card>
    </div>
  );
};

export default QuestionStats;