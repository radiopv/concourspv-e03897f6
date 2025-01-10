import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface StatusCardProps {
  isQualified: boolean;
}

export const StatusCard = ({ isQualified }: StatusCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-500" />
          Statut
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-600">
          {isQualified ? "Qualifié" : "Non qualifié"}
        </p>
      </CardContent>
    </Card>
  );
};