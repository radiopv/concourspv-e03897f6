import React, { useState } from 'react';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import EditContestForm from './EditContestForm';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ContestListHeader from './contest-list/ContestListHeader';
import ContestListGrid from './contest-list/ContestListGrid';
import { useContestQueries } from './hooks/useContestQueries';
import { useContestMutations } from './hooks/useContestMutations';

type ContestStatus = 'draft' | 'active' | 'archived';

interface ContestListProps {
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
  onSelectContest: (id: string) => void;
}

const ContestList = ({ contests, onSelectContest }: ContestListProps) => {
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { contestsWithCounts, isLoading } = useContestQueries();
  const { 
    deleteMutation,
    archiveMutation,
    featureToggleMutation,
    statusUpdateMutation 
  } = useContestMutations();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ContestListHeader />
      
      <ContestListGrid
        contests={contestsWithCounts || contests}
        onDelete={(id) => deleteMutation.mutate(id)}
        onArchive={(id) => archiveMutation.mutate(id)}
        onFeatureToggle={(id, featured) => featureToggleMutation.mutate({ id, featured })}
        onStatusUpdate={(id, updates) => statusUpdateMutation.mutate({ id, updates })}
        onSelect={onSelectContest}
        onEdit={setEditingContestId}
        editingContestId={editingContestId}
      />

      {editingContestId && (
        <Collapsible open={true} onOpenChange={() => setEditingContestId(null)}>
          <CollapsibleContent className="p-4 bg-white rounded-lg shadow mt-4">
            <EditContestForm
              contestId={editingContestId}
              onClose={() => {
                setEditingContestId(null);
                queryClient.invalidateQueries({ queryKey: ['contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
              }}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default ContestList;