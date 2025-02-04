import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RANKS } from "@/services/pointsService";
import { Star } from "lucide-react";

const RanksList = () => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-red-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
          Niveaux & Avantages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-lg text-center hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{rank.badge}</div>
              <div className="font-bold text-lg text-amber-800 mb-2">{rank.rank}</div>
              <div className="text-sm text-amber-600 mb-4">
                {rank.minPoints} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints} pts
              </div>
              <div className="space-y-2">
                {rank.benefits.map((benefit, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center text-sm text-gray-600 justify-center"
                  >
                    <Star className="h-4 w-4 text-amber-500 mr-2 inline-block flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanksList;