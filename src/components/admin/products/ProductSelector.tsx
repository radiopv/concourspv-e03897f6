import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface ProductSelectorProps {
  contestId: string;
  onSelectProduct: (productId: string) => void;
}

export const ProductSelector = ({ contestId, onSelectProduct }: ProductSelectorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['available-products', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const addProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('contest_prizes')
        .insert([{
          contest_id: contestId,
          product_id: productId
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-prizes', contestId] });
      toast({
        title: "Succès",
        description: "Le produit a été ajouté aux prix du concours",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit: " + error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit Printful
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sélectionner un produit</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
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
                    <Button
                      onClick={() => addProductMutation.mutate(product.id)}
                      size="sm"
                    >
                      Sélectionner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};