import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditQuestionsList from './EditQuestionsList';
import ContestBasicForm from './ContestBasicForm';

interface EditContestFormProps {
  contestId: string;
  onClose: () => void;
}

const EditContestForm = ({ contestId, onClose }: EditContestFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const [formData, setFormData] = useState({
    title: contest?.title || '',
    description: contest?.description || '',
    start_date: contest?.start_date || '',
    end_date: contest?.end_date || '',
    is_featured: contest?.is_featured || false,
    is_new: contest?.is_new || false,
    has_big_prizes: contest?.has_big_prizes || false,
    shop_url: contest?.shop_url || '',
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Utiliser le bucket "prizes" au lieu de "contests"
      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('contests')
        .update({ prize_image_url: publicUrl })
        .eq('id', contestId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      toast({
        title: "Succès",
        description: "L'image a été mise à jour",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contests')
        .update({
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          has_big_prizes: formData.has_big_prizes,
          shop_url: formData.shop_url,
        })
        .eq('id', contestId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      
      toast({
        title: "Succès",
        description: "Le concours a été mis à jour",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le concours",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le concours</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ContestBasicForm
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              uploading={uploading}
            />
            <Button type="submit" className="w-full">
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>

      <EditQuestionsList contestId={contestId} />
    </div>
  );
};

export default EditContestForm;