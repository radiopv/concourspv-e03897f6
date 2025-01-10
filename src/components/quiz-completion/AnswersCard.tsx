import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface AnswersCardProps {
  correctAnswers: number;
  totalQuestions: number;
}

export const AnswersCard = ({ correctAnswers, totalQuestions }: AnswersCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-purple-500" />
          Bonnes Réponses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-purple-600">
          {correctAnswers}/{totalQuestions}
        </p>
      </CardContent>
    </Card>
  );
};