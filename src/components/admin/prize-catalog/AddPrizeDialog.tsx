import React from 'react';
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
  return (
    <Dialog>
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
          onSave={onSave}
          onImageUpload={onImageUpload}
          uploading={uploading}
        />
      </DialogContent>
    </Dialog>
  );
};