import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PrizeFormData } from "../types";

interface PrizeFormProps {
  initialData?: PrizeFormData;
  onSubmit: (data: PrizeFormData) => void;
  isEditing?: boolean;
}

export const PrizeForm = ({ initialData, onSubmit, isEditing = false }: PrizeFormProps) => {
  const [formData, setFormData] = useState<PrizeFormData>(
    initialData || {
      name: "",
      description: "",
      value: undefined,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du prix</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="h-32"
        />
      </div>

      <div>
        <Label htmlFor="value">Prix (€)</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={formData.value || ''}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Mettre à jour" : "Ajouter au catalogue"}
      </Button>
    </form>
  );
};