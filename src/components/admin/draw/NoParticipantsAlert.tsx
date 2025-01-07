import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NoParticipantsAlertProps {
  requiredScore: number;
}

export const NoParticipantsAlert = ({ requiredScore }: NoParticipantsAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Aucun participant n'est actuellement éligible pour le tirage.
        Les participants doivent avoir complété le questionnaire avec un score minimum de {requiredScore}%.
      </AlertDescription>
    </Alert>
  );
};