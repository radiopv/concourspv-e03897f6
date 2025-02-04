import React from 'react';
import { motion } from "framer-motion";
import UserRankProgress from '@/components/points/UserRankProgress';
import RanksList from '@/components/points/RanksList';
import TopParticipantsList from '@/components/points/TopParticipantsList';

const Points = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Récompenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez, enchaînez les bonnes réponses et gagnez des points bonus !
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <UserRankProgress />
            <TopParticipantsList />
          </div>
          <div>
            <RanksList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;