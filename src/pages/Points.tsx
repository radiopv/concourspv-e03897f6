import React from 'react';
import { motion } from "framer-motion";
import PointsOverview from '@/components/dashboard/PointsOverview';
import RanksList from '@/components/points/RanksList';

const Points = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-4">
            Système de Points & Rangs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez aux concours, gagnez des points et progressez dans les rangs !
          </p>
        </motion.div>

        <div className="space-y-8">
          <PointsOverview />
          <RanksList />
        </div>
      </div>
    </div>
  );
};

export default Points;