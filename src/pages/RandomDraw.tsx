import { useState } from 'react';
import { FileImport } from '@/components/random-draw/FileImport';
import { ParticipantsList } from '@/components/random-draw/ParticipantsList';
import { DrawSection } from '@/components/random-draw/DrawSection';
import { useToast } from "@/hooks/use-toast";

interface Participant {
  nom: string;
  prenom: string;
  id: string;
}

const RandomDraw = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
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

  const performDraw = () => {
    if (participants.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun participant disponible pour le tirage",
        variant: "destructive",
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    setWinner(selectedWinner);
    toast({
      title: "Tirage effectué !",
      description: `Le gagnant est ${selectedWinner.prenom} ${selectedWinner.nom}`,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tirage au Sort</h1>
      
      <FileImport onParticipantsImported={handleParticipantsImported} />
      
      <ParticipantsList 
        participants={participants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <DrawSection 
        participants={participants}
        winner={winner}
        onDraw={performDraw}
      />
    </div>
  );
};

export default RandomDraw;