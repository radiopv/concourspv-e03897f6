import { supabase } from "@/lib/supabase";

export const saveQuestionnaireCompletion = async (contestId: string) => {
  const { data } = await supabase.auth.getSession();
  if (!data?.session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Mettre à jour le statut du participant à 'completed'
  const { error } = await supabase
    .from('participants')
    .update({ status: 'completed' })
    .eq('contest_id', contestId)
    .eq('id', data.session.user.id);

  if (error) {
    throw error;
  }
};
