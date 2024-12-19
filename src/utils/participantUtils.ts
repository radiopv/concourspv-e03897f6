import { supabase } from "@/lib/supabase";

export const checkExistingParticipant = async (email: string, contestId: string) => {
  const { data, error } = await supabase
    .from('participants')
    .select()
    .eq('email', email)
    .eq('contest_id', contestId);

  if (error) {
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
};

export const createParticipant = async (
  firstName: string,
  lastName: string,
  email: string,
  contestId: string
) => {
  const { error } = await supabase
    .from('participants')
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        contest_id: contestId,
        status: 'pending'
      }
    ]);

  if (error) {
    throw error;
  }
};
