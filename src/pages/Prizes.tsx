import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestPrizes from "@/components/contest/ContestPrizes";

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
      const transformedPrizes = data?.map(item => ({
        prize_catalog: {
          id: item.prize_catalog.id,
          name: item.prize_catalog.name,
          description: item.prize_catalog.description,
          image_url: item.prize_catalog.image_url,
          value: item.prize_catalog.value,
          shop_url: item.prize_catalog.shop_url
        }
      })) || [];

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