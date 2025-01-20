import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const drawService = {
  async performDraw(contestId: string, queryClient: QueryClient) {
    try {
      // Get all eligible participants
      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'completed')
        .gte('score', 90);

      if (participantsError) throw participantsError;

      if (!participants || participants.length === 0) {
        throw new Error('No eligible participants found');
      }

      // Randomly select a winner
      const randomIndex = Math.floor(Math.random() * participants.length);
      const winner = participants[randomIndex];

      // Record the draw in history
      const { error: historyError } = await supabase
        .from('draw_history')
        .insert({
          contest_id: contestId,
          participant_id: winner.id,
        });

      if (historyError) throw historyError;

      // Update winner status
      const { error: winnerError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', winner.id);

      if (winnerError) throw winnerError;

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['participants'] });
      await queryClient.invalidateQueries({ queryKey: ['draw-history'] });

      return winner;
    } catch (error) {
      console.error('Error performing draw:', error);
      throw error;
    }
  }
};