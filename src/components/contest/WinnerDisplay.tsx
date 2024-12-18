import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface WinnerDisplayProps {
  contestId: string;
}

const WinnerDisplay = ({ contestId }: WinnerDisplayProps) => {
  const { data: winner } = useQuery({
    queryKey: ['contest-winner', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'winner');
      
      if (error) throw error;
      // Return the first winner or null if none exists
      return data && data.length > 0 ? data[0] : null;
    }
  });

  if (!winner) return null;

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <CardTitle className="text-2xl">Gagnant du concours</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xl font-semibold">
            {winner.first_name} {winner.last_name}
          </p>
          <p className="text-sm text-gray-600">
            Félicitations à notre grand gagnant !
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinnerDisplay;