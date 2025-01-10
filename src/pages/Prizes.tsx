import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestPrizes from "@/components/contest/ContestPrizes";
import type { Prize } from "@/types/prize";

const PrizesPage = () => {
  const { data: prizesData, isLoading } = useQuery({
    queryKey: ["prizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select(`
          prize_catalog (
            id,
            name,
            description,
            image_url,
            value,
            shop_url
          )
        `);

      if (error) throw error;

      // Transform the data to match the Prize type
      const transformedPrizes = data?.map(item => {
        const catalogItem = item.prize_catalog[0];
        if (!catalogItem) return null;
        
        return {
          id: catalogItem.id,
          name: catalogItem.name,
          description: catalogItem.description,
          image_url: catalogItem.image_url,
          value: catalogItem.value,
          shop_url: catalogItem.shop_url
        };
      }).filter((prize): prize is Prize => prize !== null) || [];

      return transformedPrizes;
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Nos Prix</h1>
      <ContestPrizes prizes={prizesData} isLoading={isLoading} />
    </div>
  );
};

export default PrizesPage;