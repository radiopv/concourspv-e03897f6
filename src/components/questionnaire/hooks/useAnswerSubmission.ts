import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  question_text: string;
  correct_answer?: string;
}

interface Answer {
  questionId: string;
  answer: string;
}

export const useAnswerSubmission = (contestId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitAnswer = async (question: Question | undefined) => {
    if (!question) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Get current participant
      const { data: participant } = await supabase
        .from('participants')
        .select('id')
        .eq('email', session.session.user.email)
        .maybeSingle();

      if (!participant) {
        // Create new participant if doesn't exist
        const { data: newParticipant, error: participantError } = await supabase
          .from('participants')
          .insert({
            email: session.session.user.email,
            first_name: session.session.user.user_metadata.first_name || '',
            last_name: session.session.user.user_metadata.last_name || ''
          })
          .select('id')
          .single();

        if (participantError) throw participantError;
        
        // Get current participation or create new one
        const { data: participation, error: participationError } = await supabase
          .from('participations')
          .insert({
            participant_id: newParticipant.id,
            contest_id: contestId,
            attempts: 1,
            status: 'active'
          })
          .select('id, attempts')
          .single();

        if (participationError) throw participationError;

        return participation;
      }

      // Get current participation or create new one
      const { data: participation, error: participationError } = await supabase
        .from('participations')
        .select('id, attempts')
        .eq('participant_id', participant.id)
        .eq('contest_id', contestId)
        .maybeSingle();

      if (participationError) throw participationError;

      if (!participation) {
        const { data: newParticipation, error: newParticipationError } = await supabase
          .from('participations')
          .insert({
            participant_id: participant.id,
            contest_id: contestId,
            attempts: 1,
            status: 'active'
          })
          .select('id, attempts')
          .single();

        if (newParticipationError) throw newParticipationError;
        return newParticipation;
      }

      return participation;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse.",
      });
      throw error;
    }
  };

  return {
    handleSubmitAnswer,
    isSubmitting
  };
};