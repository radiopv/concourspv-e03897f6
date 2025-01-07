import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import { Contest, ContestWithParticipantCount } from "@/types/contest";

const ContestsList = () => {
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, isLoading, error } = useContests();

  console.log('ContestsList render state:', { isLoading, error, contestsCount: contests?.length });

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (!contests && !error) {
    console.log('Waiting for contests data...');
    return null;
  }

  if (error) {
    console.error('ContestsList error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Impossible de charger les concours
            </h2>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="text-center py-8">
            <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">
              Aucun concours disponible
            </h2>
            <Button onClick={() => navigate("/")} variant="outline">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contestsWithCount: ContestWithParticipantCount[] = contests.map((contest: Contest) => ({
    ...contest,
    participants: {
      count: contest.participants?.length || 0,
      data: contest.participants
    }
  }));

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
          {contestsWithCount.map((contest, index) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onSelect={setSelectedContestId}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;