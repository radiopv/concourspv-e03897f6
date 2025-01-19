import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANKS } from "@/services/pointsService";
import { motion } from "framer-motion";

const RanksList = () => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
          Niveaux & Avantages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-4 rounded-lg text-center hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{rank.badge}</div>
              <div className="font-bold text-amber-800">{rank.rank}</div>
              <div className="text-sm text-amber-600">
                {rank.minPoints} pts
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksList;