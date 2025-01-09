// ... keep existing code
import { supabase } from "@/lib/supabase";

export const drawService = {
  async performDraw(contestId: string) {
    // Check for existing winner
    const { data: existingWinner } = await supabase
      .from('participants')
      .select('id')
      .eq('contest_id', contestId)
      .eq('status', 'WINNER')
      .single();

    if (existingWinner) {
      throw new Error('Un gagnant a déjà été tiré au sort pour ce concours');
    }

    // Get eligible participants
    const { data: eligibleParticipants } = await supabase
      .from('participants')
      .select('*')
      .eq('contest_id', contestId)
      .gte('score', 70)
      .is('status', null);

    if (!eligibleParticipants?.length) {
      throw new Error('Aucun participant éligible trouvé');
    }

    // Select random winner
    const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

    // Update winner status
    const { error: updateError } = await supabase
      .from('participants')
      .update({ status: 'WINNER' })
      .eq('id', winner.id);

    if (updateError) throw updateError;

    // Record in draw history
    const { error: historyError } = await supabase
      .from('draw_history')
      .insert({
        contest_id: contestId,
        participant_id: winner.id,
        draw_date: new Date().toISOString()
      });

    if (historyError) throw historyError;

    // Send winner notification
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
