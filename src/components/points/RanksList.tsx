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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{rank.badge}</span>
                <div>
                  <h3 className="font-bold text-lg text-amber-800">{rank.rank}</h3>
                  <p className="text-sm text-amber-600">
                    {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} points
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700">
                {rank.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksList;