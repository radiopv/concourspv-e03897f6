import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestPrizes from "@/components/contest/ContestPrizes";

const PrizesPage = () => {
  const { data: prizes, isLoading } = useQuery({
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
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Nos Prix</h1>
      <ContestPrizes prizes={prizes} isLoading={isLoading} />
    </div>
  );
};

export default PrizesPage;