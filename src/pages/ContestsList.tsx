import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";

const ContestsList = () => {
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading } = useContests();

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full glass-card p-8"
        >
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold text-amber-800 text-center mb-4">
            Aucun concours disponible
          </h2>
          <p className="text-amber-700 text-center mb-6">
            Revenez plus tard pour découvrir nos nouveaux concours !
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full tropical-button"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 rounded-full"></div>
            <Trophy className="w-20 h-20 text-amber-500 relative z-10 mx-auto" />
          </div>
          <h1 className="page-title">
            Concours Disponibles
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Tentez votre chance et gagnez des prix exceptionnels !
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContestCard
                contest={contest}
                onSelect={setSelectedContestId}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;