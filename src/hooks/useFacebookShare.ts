import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ShareResult {
  points_awarded: number;
  total_shares_this_month: number;
  bonus_awarded: number;
  extra_participation_added: number;
  message: string;
}

export const useFacebookShare = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const shareToFacebook = async (
    url: string,
    type: 'contest' | 'score' | 'general',
    contestId?: string
  ) => {
    try {
      // Add debug parameter
      const debugUrl = `${url}${url.includes('?') ? '&' : '?'}_fb_debug=true`;
      
      // Build Facebook share URL
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(debugUrl)}`;
      
      // Open share dialog
      const width = 626;
      const height = 436;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        fbShareUrl,
        'facebook-share-dialog',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (user) {
        const { data, error } = await supabase.rpc('handle_facebook_share', {
          input_user_id: user.id,
          share_type: type,
          contest_id: contestId
        });

        if (error) {
          console.error('Error sharing:', error);
          throw error;
        }

        const result = data as ShareResult;
        
        if (result.points_awarded > 0) {
          const message = type === 'contest'
            ? "You earned 5 points and a bonus participation!"
            : "You earned 5 points for sharing!";

          toast({
            title: "Share successful!",
            description: message,
            duration: 5000,
          });
        } else {
          toast({
            title: "Share successful!",
            description: "You have reached the monthly limit for rewarded shares.",
            duration: 5000,
          });
        }

        return result;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "An error occurred while sharing",
        variant: "destructive",
      });
    }
  };

  return { shareToFacebook };
};