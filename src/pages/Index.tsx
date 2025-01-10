import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy, Users, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: contests, isLoading } = useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    staleTime: 300000, // 5 minutes
    gcTime: 3600000, // 1 hour
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Helmet>
        <title>Concours en ligne - Participez et gagnez des prix</title>
        <meta name="description" content="Découvrez nos concours en ligne, participez et gagnez des prix exceptionnels. Nouveaux concours ajoutés régulièrement." />
        <meta name="keywords" content="concours en ligne, prix à gagner, jeux concours, participation gratuite" />
        <meta property="og:title" content="Concours en ligne - Participez et gagnez des prix" />
        <meta property="og:description" content="Découvrez nos concours en ligne, participez et gagnez des prix exceptionnels. Nouveaux concours ajoutés régulièrement." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" aria-label="Liste des concours actifs">
            Concours Actifs
          </h1>
          <p className="text-xl text-gray-600">
            Participez à nos concours et tentez de gagner des prix exceptionnels
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Chargement des concours">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contests?.map((contest) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Card 
                  className="h-full flex flex-col hover:shadow-lg transition-shadow"
                  role="article"
                  aria-labelledby={`contest-title-${contest.id}`}
                >
                  <CardHeader>
                    <CardTitle 
                      id={`contest-title-${contest.id}`}
                      className="text-lg font-bold"
                    >
                      {contest.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 mb-4">{contest.description}</p>
                    <div className="mt-auto">
                      <Link 
                        to={`/contests/${contest.id}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        aria-label={`Participer au concours ${contest.title}`}
                      >
                        Participer
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {contests?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Aucun concours actif pour le moment. Revenez bientôt !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;