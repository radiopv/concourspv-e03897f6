import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface ScoreCardProps {
  score: number;
}

export const ScoreCard = ({ score }: ScoreCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Score Final
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-amber-600">{score}%</p>
      </CardContent>
    </Card>
  );
};