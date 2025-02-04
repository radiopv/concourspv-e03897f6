import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RANKS = [
  { value: 'NOVATO', label: 'Novato' },
  { value: 'HAVANA', label: 'Havana' },
  { value: 'SANTIAGO', label: 'Santiago' },
  { value: 'RIO', label: 'Rio' },
  { value: 'CARNIVAL', label: 'Carnival' },
  { value: 'ELDORADO', label: 'El Dorado' }
] as const;

interface ContestBasicFormProps {
  formData: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    draw_date: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
    shop_url?: string;
    prize_image_url?: string;
    main_image_url?: string;
    min_rank: string;
    is_rank_restricted: boolean;
  };
  setFormData: (data: any) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const ContestBasicForm = ({ formData, setFormData, handleImageUpload, uploading }: ContestBasicFormProps) => {
  return (
    <div className="space-y-4">
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
          maxLength={500}
          className="h-32"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description?.length || 0}/500 caractères
        </p>
      </div>

      <div>
        <Label htmlFor="shop_url">Lien vers la boutique</Label>
        <Input
          id="shop_url"
          type="url"
          value={formData.shop_url}
          onChange={(e) => setFormData({ ...formData, shop_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="main_image">Image principale</Label>
        <div className="space-y-2">
          {formData.main_image_url && (
            <img 
              src={formData.main_image_url} 
              alt="Image principale du concours" 
              className="max-w-xs rounded-lg"
            />
          )}
          <Input
            id="main_image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
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

      <div>
        <Label htmlFor="draw_date">Date du tirage</Label>
        <Input
          id="draw_date"
          type="date"
          value={formData.draw_date}
          onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
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

        <div className="flex items-center justify-between">
          <Label htmlFor="is_rank_restricted">Restreindre l'accès par rang</Label>
          <Switch
            id="is_rank_restricted"
            checked={formData.is_rank_restricted}
            onCheckedChange={(checked) => setFormData({ ...formData, is_rank_restricted: checked })}
          />
        </div>

        {formData.is_rank_restricted && (
          <div>
            <Label htmlFor="min_rank">Rang minimum requis</Label>
            <Select
              value={formData.min_rank}
              onValueChange={(value) => setFormData({ ...formData, min_rank: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un rang minimum" />
              </SelectTrigger>
              <SelectContent>
                {RANKS.map((rank) => (
                  <SelectItem key={rank.value} value={rank.value}>
                    {rank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestBasicForm;
