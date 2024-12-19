import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Users, Timer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../../App";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

const ActiveContestsSection = () => {
  const { data: contests, isLoading } = useQuery({
    queryKey: ['active-contests-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (count),
          prizes (
            prize_catalog (
              name,
              image_url
            )
          )
        `)
        .eq('status', 'active')
        .order('end_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">Concours en cours</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participez à nos concours actifs et tentez de gagner des prix exceptionnels !
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-48 bg-gray-200" />
                <CardContent className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {contests?.map((contest) => {
              const daysLeft = differenceInDays(new Date(contest.end_date), new Date());
              const mainPrize = contest.prizes?.[0]?.prize_catalog;

              return (
                <motion.div key={contest.id} variants={item}>
                  <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
                    {mainPrize?.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={mainPrize.image_url}
                          alt={mainPrize.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {mainPrize.name && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white font-medium">{mainPrize.name}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-6 space-y-4">
                      <CardTitle>{contest.title}</CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{contest.participants?.[0]?.count || 0} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          <span>
                            {daysLeft > 0 
                              ? `${daysLeft} jours restants`
                              : "Dernier jour !"
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {contest.is_new && (
                          <Badge variant="secondary" className="bg-blue-500 text-white">
                            Nouveau
                          </Badge>
                        )}
                        {contest.has_big_prizes && (
                          <Badge variant="secondary" className="bg-amber-500 text-white">
                            Gros lots
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className="w-full group" 
                        onClick={() => window.location.href = `/contests/${contest.id}`}
                      >
                        Participer
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/contests'}
            className="group"
          >
            Voir tous les concours
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ActiveContestsSection;