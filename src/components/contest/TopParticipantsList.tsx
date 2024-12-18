import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

interface Profile {
  full_name: string;
  avatar_url: string | null;
}

interface TopParticipant {
  id: string;
  score: number;
  profile: Profile[];
}

interface TopParticipantsListProps {
  participants: TopParticipant[];
}

const TopParticipantsList = ({ participants }: TopParticipantsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="w-6 h-6 text-amber-500" />
          Top 10 des participants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants?.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${index === 0 ? 'bg-amber-500 text-white' : 
                    index === 1 ? 'bg-gray-300 text-gray-800' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-gray-100 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <span className="font-medium">
                  {participant.profile[0]?.full_name || 'Participant anonyme'}
                </span>
              </div>
              <span className="text-lg font-bold text-indigo-600">
                {participant.score}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopParticipantsList;