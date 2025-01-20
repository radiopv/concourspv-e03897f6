import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  totalAnswered: number;
}

const QuestionnaireProgress = ({
  currentQuestionIndex,
  totalQuestions,
  score,
  totalAnswered,
}: QuestionnaireProgressProps) => {
  const { data: userPoints } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) return null;

      const { data, error } = await supabase
        .from('user_points')
        .select('extra_participations')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user points:', error);
        return null;
      }

      return data;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('default_attempts')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const maxAttempts = (settings?.default_attempts || 3) + (userPoints?.extra_participations || 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
        <span>Score: {score}%</span>
      </div>
      <Progress value={(currentQuestionIndex / totalQuestions) * 100} />
      <div className="flex justify-between text-sm text-gray-600">
        <span>Questions répondues: {totalAnswered}/{totalQuestions}</span>
        <span>Tentatives: {settings?.default_attempts || 3}/{maxAttempts}</span>
      </div>
    </div>
  );
};

export default QuestionnaireProgress;