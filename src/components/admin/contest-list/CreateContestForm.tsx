import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface CreateContestFormProps {
  onContestCreated: (id: string) => void;
  onCancel: () => void;
}

const CreateContestForm: React.FC<CreateContestFormProps> = ({ onContestCreated, onCancel }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    draw_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('contests')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            status: 'draft',
            start_date: formData.start_date,
            end_date: formData.end_date,
            draw_date: formData.draw_date,
            is_featured: false,
            is_new: true,
            has_big_prizes: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await queryClient.invalidateQueries({ queryKey: ['contests'] });
        toast({
          title: "Succès",
          description: "Le concours a été créé",
        });
        onContestCreated(data.id);
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le concours",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre du concours</Label>
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Créer le concours
        </Button>
      </div>
    </form>
  );
};

export default CreateContestForm;