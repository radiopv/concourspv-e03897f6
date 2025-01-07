import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    status?: string;
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
        />
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="prize_image">Image du prix</Label>
        <Input
          id="prize_image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {formData.prize_image_url && (
          <img 
            src={formData.prize_image_url} 
            alt="Prix du concours" 
            className="mt-2 max-w-xs rounded-lg"
          />
        )}
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
      </div>
    </div>
  );
};

export default ContestBasicForm;