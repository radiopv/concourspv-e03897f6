import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import PageMetadata from "@/components/seo/PageMetadata";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RANK_POINTS } from '@/constants/ranks';

const ContestsList = () => {
  const navigate = useNavigate();
  const { data: contests, isLoading } = useContests();
  const [showLockedContests, setShowLockedContests] = useState(true);
  const canonicalUrl = `${window.location.origin}/contests`;

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

  const userRank = userPoints?.current_rank || 'NOVATO';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
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
            <Button onClick={() => navigate("/")} variant="outline" className="border-[#9b87f5] text-[#9b87f5]">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredContests = showLockedContests 
    ? contests 
    : contests.filter(contest => {
        if (!contest.is_rank_restricted) return true;
        const userPoints = RANK_POINTS[userRank as keyof typeof RANK_POINTS];
        const requiredPoints = RANK_POINTS[contest.min_rank as keyof typeof RANK_POINTS];
        return userPoints >= requiredPoints;
      });

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
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <Switch
              id="show-locked"
              checked={showLockedContests}
              onCheckedChange={setShowLockedContests}
            />
            <Label htmlFor="show-locked" className="text-gray-300">
              Afficher les concours verrouillés
            </Label>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredContests.map((contest, index) => (
            <div key={contest.id} className="w-full">
              <ContestCard
                contest={contest}
                onSelect={(id) => navigate(`/contest/${id}`)}
                index={index}
                userRank={userRank}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;
