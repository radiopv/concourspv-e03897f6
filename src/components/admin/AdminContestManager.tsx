import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import ContestBasicForm from './ContestBasicForm';

interface AdminContestManagerProps {
  contestId: string | null;
}

const AdminContestManager = ({ contestId }: AdminContestManagerProps) => {
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
  };

  const [formData, setFormData] = useState(contest || defaultFormData);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <ContestBasicForm 
        formData={formData}
        setFormData={setFormData}
        handleImageUpload={handleImageUpload}
        uploading={uploading}
      />
    </div>
  );
};

export default AdminContestManager;