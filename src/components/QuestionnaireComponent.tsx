import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";
import { ArrowRight } from "lucide-react";
import ArticleLink from './questionnaire/ArticleLink';
import AnswerOptions from './questionnaire/AnswerOptions';

interface QuestionnaireComponentProps {
  contestId: string;
}

const getRandomMessage = (isCorrect: boolean) => {
  const correctMessages = [
    "Excellente réponse ! Continuez comme ça ! 🎉",
    "Bravo ! Vous êtes sur la bonne voie pour le tirage au sort ! 🌟",
    "Parfait ! Gardez ce rythme pour atteindre les 70% ! 🎯",
    "Superbe ! Votre attention aux détails paie ! 🏆",
    "Fantastique ! Vous vous rapprochez du tirage au sort ! ⭐"
  ];

  const incorrectMessages = [
    "N'oubliez pas de bien lire les articles pour trouver les bonnes réponses. Un score de 70% est nécessaire pour le tirage ! 📚",
    "Prenez votre temps pour lire les articles, les réponses s'y trouvent ! Objectif 70% pour le tirage ! 🎯",
    "Les articles contiennent toutes les informations nécessaires. Visez les 70% pour participer au tirage ! 📖",
    "Un peu plus de lecture et vous trouverez la bonne réponse ! Rappelez-vous : 70% pour le tirage ! 🔍",
    "Consultez attentivement les articles du blog, ils sont la clé du succès ! Objectif 70% ! 🗝️"
  ];

  const randomIndex = Math.floor(Math.random() * (isCorrect ? correctMessages.length : incorrectMessages.length));
  return isCorrect ? correctMessages[randomIndex] : incorrectMessages[randomIndex];
};

const QuestionnaireComponent = ({ contestId }: QuestionnaireComponentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, article_url, order_number')
        .eq('contest_id', contestId)
        .order('order_number');
      
      if (error) throw error;
      return data;
    }
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const ensureParticipantExists = async (userId: string) => {
    // First check if participant already exists
    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', userId)
      .eq('contest_id', contestId)
      .single();

    if (existingParticipant) {
      return existingParticipant.id;
    }

    // If not, create new participant
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const { data: newParticipant, error: participantError } = await supabase
      .from('participants')
      .insert([{
        user_id: userId,
        contest_id: contestId,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        status: 'active'
      }])
      .select('id')
      .single();

    if (participantError) throw participantError;
    return newParticipant.id;
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour participer",
          variant: "destructive",
        });
        return;
      }

      // Ensure participant exists and get participant ID
      const participantId = await ensureParticipantExists(session.session.user.id);

      const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
      setIsCorrect(isAnswerCorrect);
      setHasAnswered(true);

      const { error } = await supabase
        .from('participant_answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          answer: selectedAnswer
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['questions', contestId] });
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });

      const message = getRandomMessage(isAnswerCorrect);
      toast({
        title: isAnswerCorrect ? "Bonne réponse ! 🎉" : "Mauvaise réponse",
        description: message,
        variant: isAnswerCorrect ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre réponse",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setHasClickedLink(false);
      setHasAnswered(false);
      setIsCorrect(null);
    } else {
      toast({
        title: "Félicitations !",
        description: "Vous avez terminé le questionnaire",
      });
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
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentQuestionIndex / questions.length) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          
          {currentQuestion?.article_url && (
            <ArticleLink
              url={currentQuestion.article_url}
              onArticleRead={() => setHasClickedLink(true)}
            />
          )}
          
          <AnswerOptions
            options={currentQuestion?.options || []}
            selectedAnswer={selectedAnswer}
            correctAnswer={hasAnswered ? currentQuestion?.correct_answer : undefined}
            hasAnswered={hasAnswered}
            isDisabled={currentQuestion?.article_url && !hasClickedLink}
            onAnswerSelect={setSelectedAnswer}
          />

          {!hasAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || (currentQuestion?.article_url && !hasClickedLink) || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Valider la réponse"}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              variant="outline"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                "Terminer le quiz"
              ) : (
                <>
                  Question suivante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireComponent;