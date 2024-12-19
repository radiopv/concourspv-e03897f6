import { supabase } from "../../App";

export const saveQuestionnaireCompletion = async (contestId: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Mettre à jour le statut du participant à 'completed'
  const { error } = await supabase
    .from('participants')
    .update({ status: 'completed' })
    .eq('contest_id', contestId)
    .eq('id', session.session.user.id);

  if (error) {
    throw error;
  }
};