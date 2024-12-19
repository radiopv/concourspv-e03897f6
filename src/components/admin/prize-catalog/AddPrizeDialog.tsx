import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrizeForm } from './PrizeForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AddPrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<string | null>;
  uploading: boolean;
}

export const AddPrizeDialog = ({ 
  open, 
  onOpenChange,
  onImageUpload,
  uploading 
}: AddPrizeDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image_url: '',
    shop_url: '',
  });

  const addPrize = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('prize_catalog')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        value: '',
        image_url: '',
        shop_url: '',
      });
      toast({
        title: "Succès",
        description: "Le prix a été ajouté au catalogue",
      });
    },
    meta: {
      onError: (error: Error) => {
        console.error("Add prize error:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le prix",
          variant: "destructive",
        });
      }
    }
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = await onImageUpload(event);
    if (url) {
      handleFormChange('image_url', url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un prix au catalogue</DialogTitle>
        </DialogHeader>
        <PrizeForm
          formData={formData}
          onFormChange={handleFormChange}
          onImageUpload={handleImageUploadChange}
          onCancel={() => onOpenChange(false)}
          onSave={() => addPrize.mutate(formData)}
          uploading={uploading}
        />
      </DialogContent>
    </Dialog>
  );
};