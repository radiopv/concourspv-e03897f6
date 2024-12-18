import { create } from 'zustand';

interface QuestionnaireState {
  currentQuestionIndex: number;
  selectedAnswer: string;
  score: number;
  totalAnswered: number;
  hasClickedLink: boolean;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  isSubmitting: boolean;
  participationId: string | null;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  setSelectedAnswer: (answer: string) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setTotalAnswered: (total: number | ((prev: number) => number)) => void;
  setHasClickedLink: (clicked: boolean) => void;
  setHasAnswered: (answered: boolean) => void;
  setIsCorrect: (correct: boolean | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setParticipationId: (id: string | null) => void;
}

export const useQuestionnaireState = create<QuestionnaireState>((set) => ({
  currentQuestionIndex: 0,
  selectedAnswer: "",
  score: 0,
  totalAnswered: 0,
  hasClickedLink: false,
  hasAnswered: false,
  isCorrect: null,
  isSubmitting: false,
  participationId: null,
  setCurrentQuestionIndex: (index) => set((state) => ({
    currentQuestionIndex: typeof index === 'function' ? index(state.currentQuestionIndex) : index
  })),
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  setScore: (score) => set((state) => ({
    score: typeof score === 'function' ? score(state.score) : score
  })),
  setTotalAnswered: (total) => set((state) => ({
    totalAnswered: typeof total === 'function' ? total(state.totalAnswered) : total
  })),
  setHasClickedLink: (clicked) => set({ hasClickedLink: clicked }),
  setHasAnswered: (answered) => set({ hasAnswered: answered }),
  setIsCorrect: (correct) => set({ isCorrect: correct }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setParticipationId: (id) => set({ participationId: id })
}));