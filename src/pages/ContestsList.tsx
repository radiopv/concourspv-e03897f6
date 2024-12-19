import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import Layout from "@/components/Layout";

const ContestsList = () => {
  const navigate = useNavigate();
  const { data: contests, isLoading } = useContests();

  const handleContestSelect = (id: string) => {
    navigate(`/contest/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
          <Card className="max-w-lg w-full glass-card">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-bounce" />
              <h2 className="text-2xl font-semibold mb-4">
                Aucun concours n'est actuellement disponible
              </h2>
              <p className="text-gray-600 mb-6">
                Revenez plus tard pour découvrir nos nouveaux concours !
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-amber-500 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
                Nos Concours
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos concours exceptionnels et leurs lots incroyables à gagner !
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest, index) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onSelect={handleContestSelect}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContestsList;