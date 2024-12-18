import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants:participants(count),
          questions:questions(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }
      
      console.log('Fetched contests:', data); // Debug log
      return data || [];
    },
    refetchInterval: 5000
  });

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center py-12">
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

  const calculateWinningChance = (participants: number, totalPrizes: number) => {
    if (participants === 0) return 100;
    return Math.round((totalPrizes / participants) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              Concours Disponibles
            </h1>
            <p className="text-xl text-gray-600">
              Choisissez un concours et tentez votre chance !
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{contest.title}</CardTitle>
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
                    <p className="text-gray-600 mb-6 flex-1">
                      {contest.description}
                    </p>
                  )}
                  
                  {contest.prize_image_url && (
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={contest.prize_image_url}
                        alt="Prix à gagner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {contest.shop_url && (
                    <a
                      href={contest.shop_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
                    >
                      <Trophy className="w-4 h-4" />
                      Voir le prix sur la boutique
                    </a>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Participants
                      </p>
                      <p>{contest.participants?.count || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Percent className="w-4 h-4 text-indigo-600" />
                        Chances de gagner
                      </p>
                      <p>{calculateWinningChance(contest.participants?.count || 0, contest.total_prizes || 1)}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Date de fin
                      </p>
                      <p>{format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedContestId(contest.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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