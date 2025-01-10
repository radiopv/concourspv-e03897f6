import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useQuestions } from './questionnaire/useQuestions';
import { useQuestionnaireState } from './questionnaire/QuestionnaireState';
import { calculateFinalScore } from './questionnaire/QuestionnaireManager';
import QuestionnaireProgress from './questionnaire/QuestionnaireProgress';
import QuestionDisplay from './questionnaire/QuestionDisplay';
import { useAttempts } from './questionnaire/hooks/useAttempts';
import { useAnswerSubmission } from './questionnaire/hooks/useAnswerSubmission';

interface QuestionnaireComponentProps {
  contestId: string;
}

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useQuestionnaireState();
  const { data: questions } = useQuestions(contestId);
  const { handleSubmitAnswer } = useAnswerSubmission(contestId);
  const currentQuestion = questions?.[state.currentQuestionIndex];

  useAttempts(contestId);

  useEffect(() => {
    const initializeParticipant = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour participer",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Get user profile data first
        const { data: userProfile } = await supabase
          .from('members')
          .select('first_name, last_name, email')
          .eq('id', session.session.user.id)
          .single();

        if (!userProfile) {
          console.error('User profile not found');
          toast({
            title: "Erreur",
            description: "Profil utilisateur non trouvé",
            variant: "destructive",
          });
          return;
        }

        // Check if participant exists
        const { data: existingParticipant, error: queryError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .maybeSingle();

        if (queryError) {
          console.error('Error checking participant:', queryError);
          throw queryError;
        }

        if (!existingParticipant) {
          console.log('Creating new participant with profile:', userProfile);
          
          const { error: createError } = await supabase
            .from('participants')
            .insert([{
              id: session.session.user.id,
              contest_id: contestId,
              status: 'pending', // Changed from 'in_progress' to 'pending'
              attempts: 0,
              score: 0,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email,
              participation_id: crypto.randomUUID()
            }]);

          if (createError) {
            console.error('Error creating participant:', createError);
            throw createError;
          }
          
          console.log('Participant created successfully');
        } else {
          console.log('Participant already exists:', existingParticipant);
        }
      } catch (error) {
        console.error('Error initializing participant:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation",
          variant: "destructive",
        });
      }
    };

    initializeParticipant();
  }, [contestId, navigate, toast]);

  const handleNextQuestion = async () => {
    if (state.currentQuestionIndex < (questions?.length || 0) - 1) {
      state.setCurrentQuestionIndex(prev => prev + 1);
      state.setSelectedAnswer("");
      state.setHasClickedLink(false);
      state.setHasAnswered(false);
      state.setIsCorrect(null);
    } else {
      state.setIsSubmitting(true);
      try {
        console.log('Starting quiz completion process...');
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          throw new Error("User not authenticated");
        }

        // Récupérer d'abord le participant
        const { data: participant, error: participantError } = await supabase
          .from('participants')
          .select('participation_id, attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .single();

        if (participantError || !participant?.participation_id) {
          console.error('Error fetching participant:', participantError);
          throw new Error("Participant not found");
        }

        console.log('Participant found:', participant);

        // Calculer le score final
        const finalScore = await calculateFinalScore(participant.participation_id);
        console.log('Final score calculated:', finalScore);

        // Mettre à jour le score et le statut du participant
        const { error: updateError } = await supabase
          .from('participants')
          .update({ 
            score: finalScore,
            status: 'completed',
            completed_at: new Date().toISOString(),
            attempts: (participant.attempts || 0) + 1
          })
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id);

        if (updateError) {
          console.error('Error updating participant:', updateError);
          throw updateError;
        }

        // Invalider les requêtes pour forcer le rafraîchissement des données
        await queryClient.invalidateQueries({ queryKey: ['contests'] });
        await queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

        console.log('Quiz completed successfully');

        toast({
          title: "Questionnaire terminé ! 🎉",
          description: `Votre score final est de ${finalScore}%. ${
            finalScore >= 70 
              ? "Félicitations ! Vous êtes éligible pour le tirage au sort !" 
              : "Continuez à participer pour améliorer vos chances !"
          }`,
          duration: 5000,
        });

        // Redirection après un délai plus long pour assurer la visibilité du toast
        setTimeout(() => {
          navigate('/contests');
        }, 2000);

      } catch (error) {
        console.error('Error completing questionnaire:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation du questionnaire",
          variant: "destructive",
        });
      } finally {
        state.setIsSubmitting(false);
      }
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg text-gray-600">Aucune question disponible.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <QuestionnaireProgress
          currentQuestionIndex={state.currentQuestionIndex}
          totalQuestions={questions?.length || 0}
          score={state.score}
          totalAnswered={state.totalAnswered}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <QuestionDisplay
          questionText={currentQuestion?.question_text || ""}
          articleUrl={currentQuestion?.article_url}
          options={currentQuestion?.options || []}
          selectedAnswer={state.selectedAnswer}
          correctAnswer={currentQuestion?.correct_answer}
          hasClickedLink={state.hasClickedLink}
          hasAnswered={state.hasAnswered}
          isSubmitting={state.isSubmitting}
          onArticleRead={() => state.setHasClickedLink(true)}
          onAnswerSelect={state.setSelectedAnswer}
          onSubmitAnswer={() => handleSubmitAnswer(currentQuestion)}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex === questions?.length - 1}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;