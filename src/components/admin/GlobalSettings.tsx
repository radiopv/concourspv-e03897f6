import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const GlobalSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [defaultAttempts, setDefaultAttempts] = useState<number>(3);
  const [requiredPercentage, setRequiredPercentage] = useState<number>(70);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setDefaultAttempts(data.default_attempts);
        setRequiredPercentage(data.required_percentage);
      }
      
      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          id: settings?.id || 1,
          default_attempts: defaultAttempts,
          required_percentage: requiredPercentage
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres globaux ont été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres Globaux
          </CardTitle>
          <CardDescription>
            Configurez les paramètres globaux du site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="defaultAttempts" className="text-sm font-medium">
                Nombre de tentatives par défaut
              </label>
              <Input
                id="defaultAttempts"
                type="number"
                min="1"
                value={defaultAttempts}
                onChange={(e) => setDefaultAttempts(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="requiredPercentage" className="text-sm font-medium">
                Pourcentage requis (%)
              </label>
              <Input
                id="requiredPercentage"
                type="number"
                min="0"
                max="100"
                value={requiredPercentage}
                onChange={(e) => setRequiredPercentage(Number(e.target.value))}
                className="max-w-xs"
              />
            </div>

            <Button 
              type="submit"
              disabled={updateSettings.isPending}
            >
              Sauvegarder les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSettings;