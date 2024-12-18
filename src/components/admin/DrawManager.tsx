import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";

interface DrawManagerProps {
  contestId: string;
}

const DrawManager = ({ contestId }: DrawManagerProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [winner, setWinner] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: contest } = useQuery({
    queryKey: ['contest-draw', contestId],
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

  // Vérifier si c'est l'heure du tirage
  useEffect(() => {
    const checkDrawTime = async () => {
      if (contest?.draw_date && new Date(contest.draw_date) <= new Date() && !winner) {
        await performDraw();
      }
    };

    const interval = setInterval(checkDrawTime, 60000); // Vérifier toutes les minutes
    checkDrawTime();

    return () => clearInterval(interval);
  }, [contest?.draw_date, winner]);

  const updateDrawDateMutation = useMutation({
    mutationFn: async (newDate: Date) => {
      const { error } = await supabase
        .from('contests')
        .update({ draw_date: newDate.toISOString() })
        .eq('id', contestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-draw'] });
      toast({
        title: "Date mise à jour",
        description: "La date du tirage a été mise à jour avec succès",
      });
    }
  });

  const performDraw = async () => {
    try {
      // Récupérer tous les participants éligibles (score >= 70%)
      const { data: eligibleParticipants, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', 70);

      if (error) throw error;

      if (!eligibleParticipants?.length) {
        toast({
          title: "Impossible d'effectuer le tirage",
          description: "Aucun participant éligible trouvé",
          variant: "destructive",
        });
        return;
      }

      // Sélectionner un gagnant au hasard
      const randomWinner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      setWinner(randomWinner);

      // Mettre à jour le statut du gagnant
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', randomWinner.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['contest-draw'] });
      queryClient.invalidateQueries({ queryKey: ['participants'] });

      toast({
        title: "Tirage effectué !",
        description: `Le gagnant est ${randomWinner.first_name} ${randomWinner.last_name}`,
      });
    } catch (error) {
      console.error('Error performing draw:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer le tirage",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (contest?.draw_date) {
      setDate(new Date(contest.draw_date));
    }
  }, [contest]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du tirage au sort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Date du tirage</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      updateDrawDateMutation.mutate(newDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={performDraw} 
            disabled={!date || new Date() < (date || new Date())}
          >
            Effectuer le tirage
          </Button>

          {winner && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold">Gagnant :</h3>
              <p>{winner.first_name} {winner.last_name}</p>
              <p className="text-sm text-gray-600">{winner.email}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawManager;