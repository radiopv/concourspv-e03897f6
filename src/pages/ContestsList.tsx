
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import PageMetadata from "@/components/seo/PageMetadata";

const ContestsList = () => {
  const navigate = useNavigate();
  const { data: contests, isLoading } = useContests();
  const canonicalUrl = `${window.location.origin}/contests`;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243B] py-12">
      <PageMetadata
        title="Concours en ligne - Participez et gagnez des prix"
        description="Découvrez nos concours en ligne, participez et tentez de gagner des prix exceptionnels. Nouveaux concours ajoutés régulièrement."
        pageUrl={canonicalUrl}
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
