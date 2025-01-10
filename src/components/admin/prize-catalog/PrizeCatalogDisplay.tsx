import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Gift, ExternalLink, Trophy } from "lucide-react";

interface PrizeCatalogDisplayProps {
  prizes: Array<{
    id: string;
    name: string;
    description?: string;
    value?: number;
    image_url?: string;
    shop_url?: string;
  }>;
}

const PrizeCatalogDisplay = ({ prizes }: PrizeCatalogDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prizes.map((prize) => (
        <motion.div
          key={prize.id}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-amber-50 hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {prize.image_url && (
                <div className="relative aspect-video">
                  <img
                    src={prize.image_url}
                    alt={prize.name}
                    className="w-full h-full object-cover"
                  />
                  {prize.value && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {prize.value}€
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-500" />
                  {prize.name}
                </h3>
                {prize.description && (
                  <p className="text-gray-600 text-sm mb-4">{prize.description}</p>
                )}
                {prize.shop_url && (
                  <a
                    href={prize.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Voir sur la boutique
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PrizeCatalogDisplay;