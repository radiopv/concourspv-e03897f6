import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useContests } from "@/hooks/useContests";
import ContestCard from "@/components/contests/ContestCard";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import { Contest } from "@/types/contest";

const ContestsList = () => {
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const { data: contests, error } = useContests();

  console.log("Contests data:", contests); // Debug log

  if (selectedContestId) {
    return <QuestionnaireComponent contestId={selectedContestId} />;
  }

  if (error) {
    console.error("Error loading contests:", error); // Debug log
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
    console.log("No contests available"); // Debug log
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

  const contestsWithCount = contests.map((contest: Contest) => ({
    ...contest,
    participants: {
      count: contest.participants?.length || 0
    }
  }));

  console.log("Processed contests:", contestsWithCount); // Debug log

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Concours Disponibles</h1>
          <p className="text-gray-600">
            Participez à nos concours et tentez de gagner des prix exceptionnels !
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestsWithCount.map((contest, index) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onSelect={() => setSelectedContestId(contest.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;