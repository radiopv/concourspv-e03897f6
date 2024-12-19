import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const StatsAndWinnersSection = () => {
  const { data: winners } = useQuery({
    queryKey: ['featured-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_winners')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos derniers gagnants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {winners?.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={winner.photo_url || "/placeholder.svg"}
                  alt={`${winner.first_name} ${winner.last_name}`}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {winner.first_name} {winner.last_name}
              </h3>
              <p className="text-gray-600 text-center">{winner.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsAndWinnersSection;