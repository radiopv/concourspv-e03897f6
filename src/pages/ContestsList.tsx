import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import ContestCard from "@/components/contests/ContestCard";
import { useContests } from "@/hooks/useContests";
import { Contest, ContestWithParticipantCount } from "@/types/contest";
import { useToast } from "@/hooks/use-toast";

const ContestsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  
  const { data: contests, isLoading, error, isError } = useContests();

  // Si un concours est sélectionné, afficher le questionnaire
  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  // Affichage du loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-600">Chargement des concours...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (isError || error) {
    console.error('Error loading contests:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les concours. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Une erreur est survenue
            </h2>
            <p className="text-gray-600 mb-6">
              Impossible de charger les concours. Veuillez réessayer plus tard.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Gestion du cas où il n'y a pas de concours
  if (!contests || contests.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
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

  // Transformation des données pour inclure le nombre de participants
  const contestsWithCount: ContestWithParticipantCount[] = contests.map((contest: Contest) => ({
    ...contest,
    participants: {
      count: contest.participants?.length || 0,
      data: contest.participants
    }
  }));

  return (
    <div className="min-h-screen py-12">
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
          {contestsWithCount.map((contest: ContestWithParticipantCount, index) => (
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