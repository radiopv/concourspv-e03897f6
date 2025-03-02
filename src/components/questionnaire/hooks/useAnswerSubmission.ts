
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types/database';
import { localData } from '@/lib/localData';
import { v4 as uuidv4 } from 'uuid';

// Local storage for participant answers
let participantAnswers: Array<{
  id: string;
  participant_id: string;
  contest_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  attempt_number: number;
  answered_at: string;
}> = [];

// Helper function to save participant answers
const saveParticipantAnswers = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('participantAnswers', JSON.stringify(participantAnswers));
  }
};

// Helper function to load participant answers
const loadParticipantAnswers = () => {
  if (typeof window !== 'undefined') {
    const storedAnswers = localStorage.getItem('participantAnswers');
    if (storedAnswers) {
      participantAnswers = JSON.parse(storedAnswers);
    }
  }
};

// Initialize data
loadParticipantAnswers();

export const useAnswerSubmission = (contestId: string) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitAnswer = async (
    participationId: string,
    currentQuestion: Question,
    selectedAnswer: string,
    totalQuestions: number,
    attemptNumber: number = 1
  ) => {
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    console.log('Submitting answer:', {
      participationId,
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect,
      attemptNumber
    });

    try {
      // Check if an answer already exists
      const existingAnswerIndex = participantAnswers.findIndex(a => 
        a.participant_id === participationId && 
        a.question_id === currentQuestion.id &&
        a.attempt_number === attemptNumber
      );

      if (existingAnswerIndex !== -1) {
        console.log('Answer already exists for this question and attempt');
        return isCorrect;
      }

      // Add new answer
      const newAnswer = {
        id: uuidv4(),
        participant_id: participationId,
        contest_id: contestId,
        question_id: currentQuestion.id,
        answer: selectedAnswer,
        is_correct: isCorrect,
        attempt_number: attemptNumber,
        answered_at: new Date().toISOString()
      };

      participantAnswers.push(newAnswer);
      saveParticipantAnswers();

      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        
        // Add points for a correct answer (simulating point system)
        console.log('Points awarded: +10 for correct answer');
      }

      return isCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre réponse"
      });
      return false;
    }
  };

  const completeQuestionnaire = async (participationId: string, totalQuestions: number) => {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    console.log('Completing questionnaire:', {
      participationId,
      finalScore,
      correctAnswers,
      totalQuestions
    });
    
    try {
      // Find the participant by participation_id
      const allParticipants = await localData.participants.getByContestId(contestId);
      const participant = allParticipants.find(p => p.participation_id === participationId);

      if (participant) {
        // Update participant status
        await localData.participants.update(participant.id, {
          status: 'completed',
          score: finalScore,
          completed_at: new Date().toISOString()
        });

        // Add completion bonus points (simulating point system)
        console.log('Points awarded: +50 for completing the questionnaire');
      }

      toast({
        title: "Félicitations !",
        description: "Questionnaire terminé avec succès !",
      });
      
      navigate(`/quiz-completion/${contestId}`);
    } catch (error) {
      console.error('Error updating participant status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre statut"
      });
    }
  };

  return {
    correctAnswers,
    submitAnswer,
    completeQuestionnaire
  };
};
