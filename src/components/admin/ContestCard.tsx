import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Prize } from "@/types/prize";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description: string;
  };
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
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
      
      return data?.map(item => ({
        id: item.catalog_item?.id || '',
        name: item.catalog_item?.name || '',
        description: item.catalog_item?.description || '',
        image_url: item.catalog_item?.image_url,
        shop_url: item.catalog_item?.shop_url,
        value: item.catalog_item?.value
      })) as Prize[];
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contest.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{contest.description}</p>
        {prizes && prizes.length > 0 && (
          <div>
            <h3>Prizes:</h3>
            <ul>
              {prizes.map(prize => (
                <li key={prize.id}>
                  <a href={prize.shop_url} target="_blank" rel="noopener noreferrer">
                    {prize.image_url && <img src={prize.image_url} alt={prize.name} />}
                    <h4>{prize.name}</h4>
                    {prize.description && <p>{prize.description}</p>}
                    {prize.value && <p>Value: {prize.value}</p>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContestCard;