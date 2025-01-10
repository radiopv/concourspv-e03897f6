import React from 'react';
import { motion } from "framer-motion";
import CommunityStats from '@/components/points/CommunityStats';
import RanksList from '@/components/points/RanksList';
import ExtraParticipations from '@/components/points/ExtraParticipations';

const PointsSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Récompenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez, gagnez des points et débloquez des récompenses exclusives !
          </p>
        </motion.div>

        <CommunityStats
          totalParticipants={1234}
          totalContests={5}
          topScore={9999}
        />

        <div className="space-y-8">
          <RanksList />
          <ExtraParticipations />
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;