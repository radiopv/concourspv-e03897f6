import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const { data: participant } = useQuery({
    queryKey: ['current-participant'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('attempts')
        .eq('id', sessionData.session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching participant:', error);
        return null;
      }

      return data;
    }
  });

  const maxAttempts = (settings?.default_attempts || 3) + (userPoints?.extra_participations || 0);
  const currentAttempt = participant?.attempts || 1;
  const remainingAttempts = maxAttempts - currentAttempt;
  
  // Ensure currentQuestionIndex doesn't exceed totalQuestions
  const displayQuestionNumber = Math.min(currentQuestionIndex, totalQuestions);

  return (
    <div className="space-y-4">
      {remainingAttempts <= 1 && (
        <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-600">
            {remainingAttempts === 1 
              ? "Attention : Il ne vous reste qu'une seule tentative !"
              : "C'est votre dernière tentative pour ce concours."}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Question {displayQuestionNumber} sur {totalQuestions}</span>
        <span>Score: {score}%</span>
      </div>
      <Progress value={(displayQuestionNumber / totalQuestions) * 100} />
      <div className="flex justify-between text-sm text-gray-600">
        <span>Questions répondues: {totalAnswered}/{totalQuestions}</span>
        <span className={remainingAttempts <= 1 ? "text-amber-600 font-medium" : ""}>
          Tentative: {currentAttempt}/{maxAttempts}
        </span>
      </div>
    </div>
  );
};

export default QuestionnaireProgress;