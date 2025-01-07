import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ContestBasicForm from './ContestBasicForm';

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
    prize_image_url: '',
    status: 'draft'
  };

  const [formData, setFormData] = useState(contest || defaultFormData);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setUploading(true);
    try {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      setFormData({ ...formData, prize_image_url: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "L'upload de l'image a échoué",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <ContestBasicForm 
        formData={formData}
        setFormData={setFormData}
        handleImageUpload={handleImageUpload}
        uploading={uploading}
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={contestMutation.isPending}
      >
        {contestId ? 'Mettre à jour le concours' : 'Créer le concours'}
      </Button>
    </form>
  );
};

export default AdminContestManager;