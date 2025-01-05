import { supabase } from "../../../App";
import { QueryClient } from "@tanstack/react-query";

export const drawService = {
  async endContestAndDraw(contestId: string, queryClient: QueryClient) {
    try {
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session expired - please login again");
      }

      // Get the required percentage from settings
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('required_percentage')
        .single();

      if (settingsError) throw settingsError;

      const requiredPercentage = settings?.required_percentage || 70;

      // Update contest status
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

      console.log(`Using required percentage: ${requiredPercentage}%`);

      // Get eligible participants
      const { data: eligibleParticipants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', requiredPercentage)
        .neq('status', 'winner');

      if (participantsError) throw participantsError;
      
      console.log('Eligible participants:', eligibleParticipants);

      if (!eligibleParticipants?.length) {
        throw new Error(`Aucun participant n'a obtenu un score suffisant (minimum ${requiredPercentage}%)`);
      }

      // Select random winner
      const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

      // Update winner status - using lowercase 'winner' to match database constraint
      const { error: winnerError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', winner.id);

      if (winnerError) throw winnerError;

      // Refresh queries
      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });

      return winner;
    } catch (error) {
      console.error('Error in endContestAndDraw:', error);
      throw error;
    }
  }
};