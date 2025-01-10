import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Prize } from "@/types/prize";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
  };
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onFeatureToggle?: (id: string, featured: boolean) => void;
  onStatusUpdate?: (id: string, updates: any) => void;
  onEdit?: (id: string) => void;
  onSelect?: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ 
  contest,
  onDelete,
  onArchive,
  onFeatureToggle,
  onStatusUpdate,
  onEdit,
  onSelect
}) => {
  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          catalog_item:prize_catalog (
            id,
            name,
            description,
            image_url,
            shop_url,
            value
          )
        `)
        .eq('contest_id', contest.id);
      
      if (error) throw error;
      
      return (data || []).map(prize => ({
        id: prize.catalog_item?.id || '',
        name: prize.catalog_item?.name || '',
        description: prize.catalog_item?.description || '',
        image_url: prize.catalog_item?.image_url || '',
        shop_url: prize.catalog_item?.shop_url || '',
        value: prize.catalog_item?.value || 0
      })) as Prize[];
    }
  });

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 hover:shadow-xl transition-all duration-300 border-amber-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
          {contest.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{contest.description}</p>
        {prizes && prizes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4 text-amber-700">Prix à gagner:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prizes.map((prize: Prize) => (
                <div key={prize.id} className="bg-white/50 backdrop-blur-sm p-4 rounded-lg hover:shadow-md transition-all">
                  <a 
                    href={prize.shop_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block space-y-2"
                  >
                    {prize.image_url && (
                      <div className="aspect-video relative overflow-hidden rounded-lg">
                        <img 
                          src={prize.image_url} 
                          alt={prize.name}
                          className="object-cover w-full h-full transform hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h4 className="font-semibold text-amber-800">{prize.name}</h4>
                    {prize.description && (
                      <p className="text-sm text-gray-600">{prize.description}</p>
                    )}
                    {prize.value && (
                      <p className="text-amber-600 font-medium">
                        Valeur: {prize.value}€
                      </p>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContestCard;