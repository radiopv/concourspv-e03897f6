import { motion } from "framer-motion";
import { Trophy, Gift, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const StatsSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      const { count: prizesCount } = await supabase
        .from('prize_catalog')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: winnersCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .gt('score', 0);

      return {
        participants: participantsCount || 0,
        prizes: prizesCount || 0,
        winners: winnersCount || 0
      };
    }
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.participants.toLocaleString()}
            </h3>
            <p className="text-gray-600">Participants actifs</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Gift className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.prizes.toLocaleString()}+
            </h3>
            <p className="text-gray-600">Cadeaux à gagner</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.winners.toLocaleString()}
            </h3>
            <p className="text-gray-600">Gagnants heureux</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;