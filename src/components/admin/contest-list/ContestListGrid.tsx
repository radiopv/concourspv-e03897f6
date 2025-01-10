import React from "react";
import ContestCard from "../ContestCard";
import { useContestMutations } from "../hooks/useContestMutations";
import { Contest } from "@/types/contest";

interface ContestListGridProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const ContestListGrid: React.FC<ContestListGridProps> = ({ contests, onSelectContest }) => {
  const { 
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation 
  } = useContestMutations();

  if (!contests || contests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun concours trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={{
            id: contest.id,
            title: contest.title,
            description: contest.description || '',
            start_date: contest.start_date,
            end_date: contest.end_date,
            draw_date: contest.draw_date,
            status: contest.status,
            is_featured: contest.is_featured,
            is_new: contest.is_new,
            has_big_prizes: contest.has_big_prizes,
            is_exclusive: contest.is_exclusive || false,
            is_limited: contest.is_limited || false,
            is_vip: contest.is_vip || false,
            participants_count: contest.participants?.count || 0,
            questions_count: contest.questions?.count || 0,
            prizes: contest.prizes || []
          }}
          onSelect={() => onSelectContest(contest.id)}
          onDelete={(id) => deleteMutation.mutate(id)}
          onArchive={(id) => archiveMutation.mutate(id)}
          onFeatureToggle={(id, featured) => featureToggleMutation.mutate({ id, featured })}
          onStatusUpdate={(id, updates) => statusUpdateMutation.mutate({ id, updates })}
          onEdit={(id) => onSelectContest(id)}
        />
      ))}
    </div>
  );
};

export default ContestListGrid;