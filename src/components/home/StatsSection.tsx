import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy, Gift, Users } from "lucide-react";

const StatsSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      // Récupérer le nombre total de participants
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre total de prix disponibles
      const { count: prizesCount } = await supabase
        .from('prize_catalog')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Récupérer le nombre de gagnants (participants avec un score > 0)
      const { count: winnersCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .gt('score', 0);

      return {
        participants: participantsCount || 0,
        prizes: prizesCount || 0,
        winners: winnersCount || 0
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });

  const statItems = [
    {
      icon: Users,
      label: "Participants",
      value: stats?.participants || 0,
    },
    {
      icon: Trophy,
      label: "Gagnants",
      value: stats?.winners || 0,
    },
    {
      icon: Gift,
      label: "Prix disponibles",
      value: stats?.prizes || 0,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos chiffres clés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <item.icon className="w-12 h-12 text-purple-600 mb-4" />
              <span className="text-4xl font-bold text-gray-900 mb-2">
                {item.value}
              </span>
              <span className="text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;