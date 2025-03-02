
import { localData } from "@/lib/localData";

export const calculateFinalScore = async (participantId: string) => {
  try {
    console.log('Calculating final score for participant:', participantId);
    
    // Find the participant
    const allParticipants = [];
    for (const contest of await localData.contests.getActive()) {
      const contestParticipants = await localData.participants.getByContestId(contest.id);
      allParticipants.push(...contestParticipants);
    }
    
    const participant = allParticipants.find(p => p.participation_id === participantId);
    
    if (!participant) {
      console.error('Participant not found:', participantId);
      throw new Error('Participant not found');
    }
    
    const currentAttempt = participant.attempts || 1;
    console.log('Current attempt number:', currentAttempt);
    
    // For this simplified version, we'll just generate a random score
    // In a real app, this would be calculated from the participant's answers
    const correctAnswers = Math.floor(Math.random() * 10) + 1;
    const totalQuestions = 10;
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Score calculation details:', {
      correctAnswers,
      totalQuestions,
      finalScore,
      attemptNumber: currentAttempt
    });
    
    // Update participant score
    await localData.participants.update(participant.id, {
      score: finalScore,
      status: finalScore >= 80 ? 'eligible' : 'completed'
    });
    
    console.log('Final score updated successfully:', finalScore);
    return finalScore;
  } catch (error) {
    console.error('Error calculating final score:', error);
    throw error;
  }
};
