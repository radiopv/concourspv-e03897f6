import React from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import PageMetadata from "@/components/seo/PageMetadata";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const ContestsList = () => {
  const navigate = useNavigate();
  const { data: contests, isLoading, error } = useContests();
  const canonicalUrl = `${window.location.origin}/contests`;

  console.log("Contests data:", contests);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  const { data: userPoints } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('user_points')
        .select('current_rank')
        .eq('user_id', session.user.id)
        .single();

      return data;
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-[#F97316] mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#F97316] bg-clip-text text-transparent">
                Nos Concours
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Chargement des concours...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="w-full">
                <Card className="w-full h-[400px] bg-black/30 animate-pulse">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B] flex items-center justify-center p-4">
        <PageMetadata
          title="Concours - Erreur de chargement"
          description="Une erreur est survenue lors du chargement des concours."
          pageUrl={canonicalUrl}
        />
        <Card className="max-w-lg w-full bg-black/30 border-[#9b87f5]/20">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-[#F97316] mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Erreur de chargement
            </h2>
            <p className="text-gray-300 mb-6">
              Une erreur est survenue lors du chargement des concours. Veuillez réessayer plus tard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B] flex items-center justify-center p-4">
        <PageMetadata
          title="Concours - Aucun concours disponible"
          description="Revenez plus tard pour découvrir nos nouveaux concours et tenter de gagner des prix exceptionnels."
          pageUrl={canonicalUrl}
        />
        <Card className="max-w-lg w-full bg-black/30 border-[#9b87f5]/20">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-[#F97316] mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Aucun concours n'est actuellement disponible
            </h2>
            <p className="text-gray-300 mb-6">
              Revenez plus tard pour découvrir nos nouveaux concours !
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B] py-12">
      <PageMetadata
        title="Concours en ligne - Participez et gagnez des prix"
        description="Découvrez nos concours en ligne, participez et tentez de gagner des prix exceptionnels. Nouveaux concours ajoutés régulièrement."
        pageUrl={canonicalUrl}
        keywords={[
          "concours en ligne",
          "jeux concours",
          "gagner des prix",
          "participation gratuite",
          "concours du moment"
        ]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-[#F97316] mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#F97316] bg-clip-text text-transparent">
              Nos Concours
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Découvrez nos concours exceptionnels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {contests.map((contest, index) => (
            <div key={contest.id} className="w-full">
              <ContestCard
                contest={contest}
                onSelect={(id) => navigate(`/contest/${id}`)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;