
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';
import { ScoreCard } from '@/components/quiz-completion/ScoreCard';
import { AnswersCard } from '@/components/quiz-completion/AnswersCard';
import { StatusCard } from '@/components/quiz-completion/StatusCard';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { localData } from '@/lib/localData';

// Load participant answers from localStorage
const getParticipantAnswers = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('participantAnswers');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const QuizCompletion = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isQualified, setIsQualified] = useState(false);
  const requiredPercentage = 80;

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!contestId) return;

      try {
        console.log('Fetching results for contest:', contestId);

        // Mock user data - in a real app, this would come from authentication
        const userEmail = "test@example.com";
        
        // Get participant information
        const participants = await localData.participants.getByContestId(contestId);
        const participant = participants.find(p => p.email === userEmail);

        if (!participant) {
          console.error('No participant found');
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Aucune participation trouvée pour ce concours",
          });
          return;
        }

        console.log('Found participant:', participant);

        // Get all questions for this contest
        const questions = await localData.questions.getByContestId(contestId);
        const totalQuestionsCount = questions.length;
        setTotalQuestions(totalQuestionsCount);

        console.log('Total questions:', totalQuestionsCount);

        // Get the participant's answers
        const allAnswers = getParticipantAnswers();
        const participantAnswers = allAnswers.filter(
          (a: any) => a.participant_id === participant.participation_id && a.contest_id === contestId
        );

        console.log('Participant answers:', participantAnswers);

        if (participantAnswers.length > 0) {
          const correct = participantAnswers.filter((answer: any) => answer.is_correct).length;
          const calculatedScore = totalQuestionsCount > 0 
            ? Math.round((correct / totalQuestionsCount) * 100) 
            : 0;

          console.log('Calculation details:', {
            correct,
            totalQuestionsCount,
            calculatedScore
          });

          setCorrectAnswers(correct);
          setScore(calculatedScore);
          setIsQualified(calculatedScore >= requiredPercentage);
        }
      } catch (error: any) {
        console.error('Error fetching quiz results:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer vos résultats",
        });
      }
    };

    fetchQuizResults();
  }, [contestId, toast]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>{isQualified ? "Félicitations !" : "Quiz terminé"}</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-amber-600 mb-4">
          Quiz terminé
        </h1>
        <p className="text-xl text-gray-600">
          Voici vos résultats
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ScoreCard score={score} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnswersCard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatusCard isQualified={isQualified} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <p className="text-lg text-gray-600 mb-4">
          Le score minimum requis est de {requiredPercentage}%. Une seule participation est autorisée par concours.
        </p>
        
        <Button
          onClick={() => navigate('/contests')}
          className="bg-amber-500 hover:bg-amber-600"
        >
          Voir tous les concours
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default QuizCompletion;
