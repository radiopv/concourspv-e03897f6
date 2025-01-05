import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GlobalSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [defaultAttempts, setDefaultAttempts] = useState<number>(3);
  const [requiredPercentage, setRequiredPercentage] = useState<number>(70);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
        
        if (error) {
          console.error('Settings fetch error:', error);
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error('Settings fetch error:', err);
        throw err;
      }
    },
    retry: false
  });

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      setDefaultAttempts(settings.default_attempts);
      setRequiredPercentage(settings.required_percentage);
      console.log('Settings loaded:', settings); // Debug log
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async () => {
      if (!settings?.id) throw new Error("Settings not found");
      
      const { data, error } = await supabase
        .from('settings')
        .update({
          default_attempts: defaultAttempts,
          required_percentage: requiredPercentage
        })
        .eq('id', settings.id)
        .select();

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
      console.error('Update error:', error);
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

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de configuration</AlertTitle>
          <AlertDescription>
            La table des paramètres n'existe pas encore dans la base de données. 
            Veuillez exécuter le script de migration pour créer la table des paramètres.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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