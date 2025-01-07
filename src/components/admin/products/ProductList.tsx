import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Plus } from "lucide-react";

interface Product {
  id: string;
  printful_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
}

export const ProductList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    }
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('import-printful-products');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Succès",
        description: "Les produits ont été importés avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'importer les produits: " + error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <div>Chargement des produits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produits Printful</h2>
        <Button 
          onClick={() => importMutation.mutate()}
          disabled={importMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${importMutation.isPending ? 'animate-spin' : ''}`} />
          Importer les produits
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {product.image_url && (
                <div className="aspect-square relative mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              )}
              <h3 className="font-semibold mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {product.price ? `${product.price}€` : 'Prix non défini'}
                </span>
                <span className="text-xs text-gray-500">
                  ID Printful: {product.printful_id}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};