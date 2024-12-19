import { motion } from "framer-motion";
import { Trophy, Users, Star, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StatsAndWinnersSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      const { data: participants } = await supabase
        .from('participants')
        .select('*');

      const { data: winners } = await supabase
        .from('participants')
        .select('*')
        .eq('status', 'winner')
        .order('created_at', { ascending: false })
        .limit(3);

      return {
        totalParticipants: participants?.length || 0,
        totalWinners: winners?.length || 0,
        recentWinners: winners || [],
        averageScore: participants?.reduce((acc, p) => acc + (p.score || 0), 0) / (participants?.length || 1)
      };
    }
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Statistiques et Gagnants
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Users className="w-10 h-10 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {stats?.totalParticipants || 0}
            </h3>
            <p className="text-gray-600">Participants</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Trophy className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {stats?.totalWinners || 0}
            </h3>
            <p className="text-gray-600">Gagnants</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Star className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(stats?.averageScore || 0)}%
            </h3>
            <p className="text-gray-600">Score Moyen</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <Medal className="w-10 h-10 mx-auto text-purple-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
            <p className="text-gray-600">Prix à Gagner</p>
          </motion.div>
        </div>

        {/* Recent Winners */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Derniers Gagnants
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats?.recentWinners.map((winner) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {winner.first_name} {winner.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Score: {winner.score}%
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsAndWinnersSection;