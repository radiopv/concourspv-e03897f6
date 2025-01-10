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
        prize_catalog: item.prize_catalog
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