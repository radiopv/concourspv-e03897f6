import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ProductSelector } from "../products/ProductSelector";

interface ContestPrizesProps {
  contestId: string;
}

export const ContestPrizes = ({ contestId }: ContestPrizesProps) => {
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['contest-prizes', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contest_prizes')
        .select(`
          id,
          product:products(*)
        `)
        .eq('contest_id', contestId);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des prix...</div>;
  }

  return (
    <div className="space-y-4">
      <ProductSelector 
        contestId={contestId}
        onSelectProduct={() => {}}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes?.map((prize) => (
          <Card key={prize.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              {prize.product.image_url && (
                <div className="aspect-square relative mb-4">
                  <img
                    src={prize.product.image_url}
                    alt={prize.product.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              )}
              <h3 className="font-semibold mb-2">{prize.product.name}</h3>
              {prize.product.description && (
                <p className="text-sm text-gray-500 mb-2">{prize.product.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {prize.product.price ? `${prize.product.price}€` : 'Prix non défini'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};