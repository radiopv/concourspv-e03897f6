import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

export const PrizeCsvImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      
      // Lire le fichier CSV
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          try {
            const prizes = results.data.map((row: any) => ({
              name: row.name || row.nom,
              description: row.description,
              value: parseFloat(row.price || row.prix) || null
            }));

            const { error } = await supabase
              .from('prize_catalog')
              .insert(prizes);

            if (error) throw error;

            queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
            
            toast({
              title: "Succès",
              description: `${prizes.length} prix ont été importés avec succès.`,
            });
          } catch (error) {
            console.error('Error importing prizes:', error);
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de l'import des prix",
              variant: "destructive",
            });
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: "Erreur",
            description: "Le fichier CSV n'est pas valide",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('File reading error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lire le fichier",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="mt-4">
      <Label htmlFor="csv-upload">Importer des prix (CSV)</Label>
      <p className="text-sm text-gray-500 mb-2">
        Le fichier doit contenir les colonnes: name/nom, description, price/prix
      </p>
      <Input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={isImporting}
        className="mt-2"
      />
    </div>
  );
};