
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { localData } from '@/lib/localData';

export const useParticipantManagement = (contestId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkExistingParticipation = async () => {
    // Check for existing completed participation
    const allParticipants = await localData.participants.getByContestId(contestId);
    const existingParticipation = allParticipants.find(p => 
      p.status === 'completed'
    );

    if (existingParticipation) {
      toast({
        title: "Participation existante",
        description: "Vous avez déjà participé à ce concours. Une seule participation est autorisée.",
      });
      navigate(`/quiz-completion/${contestId}`);
    }

    return existingParticipation;
  };

  const createOrUpdateParticipant = async () => {
    try {
      setIsSubmitting(true);
      
      // Mock user profile data for demonstration
      // In a real app, this would come from authentication
      const userProfile = {
        first_name: "Test",
        last_name: "User",
        email: "test@example.com"
      };

      if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.email) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Votre profil est incomplet. Veuillez le compléter avant de participer."
        });
        navigate('/profile');
        return null;
      }

      // Check for existing participant
      const allParticipants = await localData.participants.getByContestId(contestId);
      const existingParticipant = allParticipants.find(p => 
        p.email === userProfile.email
      );

      if (existingParticipant?.participation_id) {
        return existingParticipant.participation_id;
      }

      // Create new participant
      const newParticipant = await localData.participants.create({
        contest_id: contestId,
        status: 'pending',
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email
      });

      return newParticipant.participation_id;
    } catch (error) {
      console.error('Error creating/updating participant:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la participation."
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    checkExistingParticipation,
    createOrUpdateParticipant
  };
};
