import { supabase } from "../../../App";
import { QueryClient } from "@tanstack/react-query";

export const drawService = {
  async endContestAndDraw(contestId: string, queryClient: QueryClient) {
    // Update contest end date and status
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('contests')
      .update({ 
        end_date: now,
        draw_date: now,
        status: 'completed'
      })
      .eq('id', contestId);

    if (updateError) throw updateError;

    // Get eligible participants
    const { data: eligibleParticipants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('contest_id', contestId)
      .gte('score', 70);

    if (participantsError) throw participantsError;
    if (!eligibleParticipants?.length) {
      throw new Error("Aucun participant n'a obtenu un score suffisant (minimum 70%)");
    }

    // Select random winner
    const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

    // Update winner status - explicitly set status to match enum
    const { error: winnerError } = await supabase
      .from('participants')
      .update({ status: 'WINNER' })
      .eq('id', winner.id);

    if (winnerError) throw winnerError;

    // Refresh queries
    await queryClient.invalidateQueries({ queryKey: ['contests'] });
    await queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });

    return winner;
  }
};