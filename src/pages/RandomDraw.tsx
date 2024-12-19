import { useState } from 'react';
import { FileImport } from '@/components/random-draw/FileImport';
import { ParticipantsList } from '@/components/random-draw/ParticipantsList';
import { WheelAnimation } from '@/components/random-draw/WheelAnimation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WinnerClaimDialog from '@/components/winners/WinnerClaimDialog';

interface Participant {
  nom: string;
  prenom: string;
  id: string;
}

const RandomDraw = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleParticipantsImported = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
  };

  const handleEdit = (updatedParticipant: Participant) => {
    setParticipants(prev => 
      prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
    );
  };

  const handleDelete = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Participant supprimé",
      description: "Le participant a été retiré de la liste",
    });
  };

  const handleWinnerSelected = (selectedWinner: Participant) => {
    setWinner(selectedWinner);
    setTimeout(() => {
      setIsWinnerDialogOpen(true);
    }, 1500); // Délai pour laisser l'animation de confetti se terminer
  };

  const performDraw = () => {
    if (participants.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun participant disponible pour le tirage",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Tirage au Sort</h1>
        
        <div className="space-y-8">
          <Card className="p-6">
            <FileImport onParticipantsImported={handleParticipantsImported} />
          </Card>

          {participants.length > 0 && (
            <Card className="p-6">
              <div className="mb-8">
                <WheelAnimation 
                  participants={participants}
                  onWinnerSelected={handleWinnerSelected}
                  isSpinning={isSpinning}
                />
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={performDraw}
                  disabled={isSpinning || participants.length === 0}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                >
                  {isSpinning ? "Tirage en cours..." : "Lancer le tirage"}
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <ParticipantsList 
              participants={participants}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Card>
        </div>

        <WinnerClaimDialog 
          open={isWinnerDialogOpen}
          onOpenChange={setIsWinnerDialogOpen}
        />
      </div>
    </div>
  );
};

export default RandomDraw;