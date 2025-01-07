import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const PrizeImportButton = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting Printful products import...');
      const { data, error } = await supabase.functions.invoke('import-printful-products');
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize-catalog'] });
      toast({
        title: "Succès",
        description: "Les produits Printful ont été importés",
      });
    },
    onError: (error) => {
      console.error("Import error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'importer les produits Printful",
        variant: "destructive",
      });
    }
  });

  return (
    <Button 
      onClick={() => importMutation.mutate()}
      disabled={importMutation.isPending}
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${importMutation.isPending ? 'animate-spin' : ''}`} />
      Importer les produits Printful
    </Button>
  );
};