// ... keep existing code (imports)
import { supabase } from "@/lib/supabase";
export const drawService = {
  async performDraw(contestId: string) {
    // Vérification anti-doublons
    const { data: existingWinner } = await supabase
      .from('participants')
      .select('id')
      .eq('contest_id', contestId)
      .eq('status', 'winner')
      .single();

    if (existingWinner) {
      throw new Error('Un gagnant a déjà été tiré au sort pour ce concours');
    }

    // Sélection des participants éligibles
    const { data: eligibleParticipants } = await supabase
      .from('participants')
      .select('*')
      .eq('contest_id', contestId)
      .gte('score', 70)
      .is('status', null);

    if (!eligibleParticipants?.length) {
      throw new Error('Aucun participant éligible trouvé');
    }

    // Sélection aléatoire du gagnant
    const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

    // Mise à jour du statut du gagnant
    const { error: updateError } = await supabase
      .from('participants')
      .update({ status: 'winner' })
      .eq('id', winner.id);

    if (updateError) throw updateError;

    // Enregistrement dans l'historique
    const { error: historyError } = await supabase
      .from('draw_history')
      .insert({
        contest_id: contestId,
        participant_id: winner.id,
        draw_date: new Date().toISOString()
      });

    if (historyError) throw historyError;

    // Envoi de la notification par email (via Edge Function)
    await supabase.functions.invoke('notify-winner', {
      body: {
        winnerId: winner.id,
        contestId: contestId
      }
    });

    return winner;
  },

  async publishResults(contestId: string) {
    const { error } = await supabase
      .from('contests')
      .update({
        results_published: true,
        results_published_at: new Date().toISOString()
      })
      .eq('id', contestId);

    if (error) throw error;
  }
};
