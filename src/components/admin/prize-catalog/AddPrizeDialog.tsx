import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrizeForm } from './PrizeForm';

interface AddPrizeDialogProps {
  onSave: (formData: any) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const AddPrizeDialog = ({ onSave, onImageUpload, uploading }: AddPrizeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image_url: '',
    shop_url: '',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      value: '',
      image_url: '',
      shop_url: '',
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      value: '',
      image_url: '',
      shop_url: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un prix au catalogue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un prix au catalogue</DialogTitle>
        </DialogHeader>
        <PrizeForm
          formData={formData}
          onFormChange={handleFormChange}
          onImageUpload={onImageUpload}
          onCancel={handleCancel}
          onSave={handleSave}
          uploading={uploading}
        />
      </DialogContent>
    </Dialog>
  );
};