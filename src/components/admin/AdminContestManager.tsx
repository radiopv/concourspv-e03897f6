import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ContestBasicForm from './ContestBasicForm';

interface AdminContestManagerProps {
  contestId: string | null;
}

const AdminContestManager = ({ contestId }: AdminContestManagerProps) => {
  const { toast } = useToast();

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) return null;
      
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <ContestBasicForm 
        initialData={contest} 
        onSuccess={() => {
          toast({
            title: "Succès",
            description: `Le concours a été ${contest ? 'modifié' : 'créé'} avec succès`,
          });
        }}
      />
    </div>
  );
};

export default AdminContestManager;