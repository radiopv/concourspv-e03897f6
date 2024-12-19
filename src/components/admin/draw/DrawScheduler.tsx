import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DrawSchedulerProps {
  contestId: string;
  currentDrawDate?: string;
  onSchedule: (date: string) => void;
}

const DrawScheduler = ({ contestId, currentDrawDate, onSchedule }: DrawSchedulerProps) => {
  const { toast } = useToast();

  const handleSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const drawDate = formData.get('drawDate') as string;

    try {
      const { error } = await supabase
        .from('contests')
        .update({ draw_date: drawDate })
        .eq('id', contestId);

      if (error) throw error;

      onSchedule(drawDate);
      toast({
        title: "Tirage planifié",
        description: `Le tirage est planifié pour le ${new Date(drawDate).toLocaleDateString('fr-FR')}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de planifier le tirage",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Planifier le tirage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <Label htmlFor="drawDate">Date du tirage</Label>
            <Input
              id="drawDate"
              name="drawDate"
              type="datetime-local"
              defaultValue={currentDrawDate}
              required
            />
          </div>
          <Button type="submit">Planifier le tirage</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DrawScheduler;
