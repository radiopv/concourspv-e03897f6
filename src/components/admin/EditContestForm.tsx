import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditQuestionsList from './EditQuestionsList';
import { Switch } from "@/components/ui/switch";

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
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contests')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contests')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('contests')
        .update({ image_url: publicUrl })
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
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="image">Image du concours</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Afficher en page d'accueil</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_new">Marquer comme nouveau</Label>
                <Switch
                  id="is_new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="has_big_prizes">Gros lots à gagner</Label>
                <Switch
                  id="has_big_prizes"
                  checked={formData.has_big_prizes}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_big_prizes: checked })}
                />
              </div>
            </div>

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