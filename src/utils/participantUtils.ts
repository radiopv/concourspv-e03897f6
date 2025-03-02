
import { localData } from "@/lib/localData";

export const checkExistingParticipant = async (email: string, contestId: string) => {
  try {
    const participants = await localData.participants.getByContestId(contestId);
    return participants.find(p => p.email === email) || null;
  } catch (error) {
    console.error("Error checking existing participant:", error);
    throw error;
  }
};

export const createParticipant = async (
  firstName: string,
  lastName: string,
  email: string,
  contestId: string
) => {
  try {
    await localData.participants.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      contest_id: contestId,
      status: 'pending'
    });
  } catch (error) {
    console.error("Error creating participant:", error);
    throw error;
  }
};
