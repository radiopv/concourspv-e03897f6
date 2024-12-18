import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditContestForm from './EditContestForm';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ContestListHeader from './contest-list/ContestListHeader';
import ContestListGrid from './contest-list/ContestListGrid';
import { useContestQueries } from './hooks/useContestQueries';
import { useContestMutations } from './hooks/useContestMutations';

interface ContestListProps {
  contests: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date: string;
    end_date: string;
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
      />

      {editingContestId && (
        <Dialog open={true} onOpenChange={() => setEditingContestId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditContestForm
              contestId={editingContestId}
              onClose={() => {
                setEditingContestId(null);
                queryClient.invalidateQueries({ queryKey: ['contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
                queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContestList;