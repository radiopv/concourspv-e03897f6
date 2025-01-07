import { Trophy, Users } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DrawHeaderProps {
  contestTitle: string;
  eligibleCount: number;
  requiredScore: number;
}

export const DrawHeader = ({ contestTitle, eligibleCount, requiredScore }: DrawHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-amber-500" />
        Tirage au sort - {contestTitle}
      </CardTitle>
      <CardDescription>
        Sélectionnez un gagnant parmi les participants éligibles
      </CardDescription>
      <div className="flex items-center gap-2 text-sm mt-2">
        <Users className="w-4 h-4 text-blue-500" />
        <span>{eligibleCount} participants éligibles (score minimum : {requiredScore}%)</span>
      </div>
    </CardHeader>
  );
};