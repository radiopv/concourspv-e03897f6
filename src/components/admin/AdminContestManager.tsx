import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ContestBasicForm from './ContestBasicForm';
import ContestPrizeManager from './ContestPrizeManager';

interface AdminContestManagerProps {
  contestId: string | null;
  onSuccess?: () => void;
}

const AdminContestManager = ({ contestId, onSuccess }: AdminContestManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

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

  const defaultFormData = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    draw_date: '',
    is_featured: false,
    is_new: false,
    has_big_prizes: false,
    shop_url: '',
    status: 'draft'
  };

  const [formData, setFormData] = useState(contest || defaultFormData);

  const contestMutation = useMutation({
    mutationFn: async (data: any) => {
      if (contestId) {
        const { error } = await supabase
          .from('contests')
          .update(data)
          .eq('id', contestId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contests')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toast({
        title: "Succès",
        description: contestId ? "Le concours a été mis à jour" : "Le concours a été créé",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Error:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contestMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ContestBasicForm 
          formData={formData}
          setFormData={setFormData}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={contestMutation.isPending}
        >
          {contestId ? 'Mettre à jour le concours' : 'Créer le concours'}
        </Button>
      </form>

      {contestId && (
        <div className="pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Prix du concours</h2>
          <ContestPrizeManager contestId={contestId} />
        </div>
      )}
    </div>
  );
};

export default AdminContestManager;