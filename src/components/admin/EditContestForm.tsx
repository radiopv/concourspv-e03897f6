import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditQuestionsList from './EditQuestionsList';
import ContestBasicForm from './ContestBasicForm';
import ContestPrizeManager from './ContestPrizeManager';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface EditContestFormProps {
  contestId: string;
  onClose: () => void;
}

const EditContestForm = ({ contestId, onClose }: EditContestFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    main_image_url: '',
    min_rank: 'NOVATO',
    is_rank_restricted: false,
  });

  useEffect(() => {
    if (contest) {
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        title: contest.title || '',
        description: contest.description || '',
        start_date: formatDate(contest.start_date),
        end_date: formatDate(contest.end_date),
        draw_date: formatDate(contest.draw_date),
        is_featured: contest.is_featured || false,
        is_new: contest.is_new || false,
        has_big_prizes: contest.has_big_prizes || false,
        shop_url: contest.shop_url || '',
        prize_image_url: contest.prize_image_url || '',
        main_image_url: contest.main_image_url || '',
        min_rank: contest.min_rank || 'NOVATO',
        is_rank_restricted: contest.is_rank_restricted || false,
      });
    }
  }, [contest]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('contests')
        .update({ main_image_url: publicUrl })
        .eq('id', contestId);

      if (updateError) throw updateError;

      setFormData(prev => ({ ...prev, main_image_url: publicUrl }));
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
      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const drawDate = new Date(formData.draw_date);

      if (endDate < startDate) {
        toast({
          title: "Erreur",
          description: "La date de fin doit être postérieure à la date de début",
          variant: "destructive",
        });
        return;
      }

      if (drawDate < endDate) {
        toast({
          title: "Erreur",
          description: "La date de tirage doit être postérieure à la date de fin",
          variant: "destructive",
        });
        return;
      }

      // Validate description length
      if (formData.description && formData.description.length > 500) {
        toast({
          title: "Erreur",
          description: "La description ne doit pas dépasser 500 caractères",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('contests')
        .update({
          title: formData.title,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          draw_date: formData.draw_date,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          has_big_prizes: formData.has_big_prizes,
          shop_url: formData.shop_url,
          min_rank: formData.min_rank,
          is_rank_restricted: formData.is_rank_restricted,
        })
        .eq('id', contestId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      
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
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Enregistrer les modifications
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/admin/contests/${contestId}/questions`)}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Gérer les questions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prix du concours</CardTitle>
        </CardHeader>
        <CardContent>
          <ContestPrizeManager contestId={contestId} />
        </CardContent>
      </Card>

      <EditQuestionsList contestId={contestId} />
    </div>
  );
};

export default EditContestForm;
