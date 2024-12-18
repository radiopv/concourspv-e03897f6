import { useState } from 'react';

export const useQuestionnaireState = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    isSubmitting,
    setIsSubmitting,
    hasClickedLink,
    setHasClickedLink,
    hasAnswered,
    setHasAnswered,
    isCorrect,
    setIsCorrect,
    score,
    setScore,
    totalAnswered,
    setTotalAnswered
  };
};