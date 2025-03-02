
import { localData } from "@/lib/localData";

export const saveQuestionnaireCompletion = async (contestId: string) => {
  // In a real application with authentication, you would get the user ID
  // For this example, we'll use a mock user ID
  const mockUserId = "user123";

  try {
    // Update participant status to 'completed'
    const participants = await localData.participants.getByContestId(contestId);
    const participant = participants.find(p => p.id === mockUserId);
    
    if (participant) {
      await localData.participants.update(participant.id, { 
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    } else {
      throw new Error("Participant not found");
    }
  } catch (error) {
    console.error("Error completing questionnaire:", error);
    throw error;
  }
};
