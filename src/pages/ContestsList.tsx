import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Calendar, Users, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import { useState } from "react";

const ContestsList = () => {
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const { data: contests, isLoading } = useQuery({
    queryKey: ['active-contests'],
    queryFn: async () => {
      console.log("Fetching contests...");
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }
      
      console.log('Fetched contests:', data);
      return data || [];
    },
    refetchInterval: 5000
  });

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
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
    );
  }

  const calculateWinningChance = (participants: number, totalPrizes: number = 1) => {
    if (participants === 0) return 100;
    return Math.round((totalPrizes / participants) * 100);
  };

  return (
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
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card float">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
                    {contest.is_new && (
                      <Badge variant="secondary" className="bg-blue-500 text-white">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  {contest.has_big_prizes && (
                    <Badge variant="secondary" className="bg-amber-500 text-white flex items-center gap-1 w-fit">
                      <Trophy className="w-4 h-4" />
                      Gros lots à gagner
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {contest.description && (
                    <p className="text-gray-600 mb-6">
                      {contest.description}
                    </p>
                  )}
                  
                  {contest.prize_image_url && (
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-6 group">
                      <img
                        src={contest.prize_image_url}
                        alt="Prix à gagner"
                        className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                      />
                      {contest.shop_url && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={contest.shop_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-amber-500 px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
                          >
                            Voir le prix sur la boutique
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div className="bg-white/50 p-4 rounded-lg">
                      <p className="font-medium flex items-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Participants
                      </p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {contest.participants?.count || 0}
                      </p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg">
                      <p className="font-medium flex items-center gap-1 mb-1">
                        <Percent className="w-4 h-4 text-green-600" />
                        Chances
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateWinningChance(contest.participants?.count || 0)}%
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedContestId(contest.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
                  >
                    Participer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;