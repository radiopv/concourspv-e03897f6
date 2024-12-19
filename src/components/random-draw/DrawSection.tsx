import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  nom: string;
  prenom: string;
  id: string;
}

interface DrawSectionProps {
  participants: Participant[];
  winner: Participant | null;
  onDraw: () => void;
}

export const DrawSection = ({ participants, winner, onDraw }: DrawSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tirage au Sort</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onDraw}
          disabled={participants.length === 0}
          className="w-full mb-4"
        >
          Effectuer le tirage
        </Button>

        {winner && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">Gagnant :</h3>
            <p className="text-lg">{winner.prenom} {winner.nom}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};