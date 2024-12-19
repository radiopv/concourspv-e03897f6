import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Participant {
  nom: string;
  prenom: string;
  id: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
}

export const ParticipantsList = ({ participants, onEdit, onDelete }: ParticipantsListProps) => {
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const { toast } = useToast();

  const handleEdit = (participant: Participant) => {
    onEdit(participant);
    setEditingParticipant(null);
    toast({
      title: "Participant modifié",
      description: "Les informations ont été mises à jour",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Liste des Participants ({participants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
              <span>{participant.prenom} {participant.nom}</span>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingParticipant(participant)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier le participant</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="Prénom"
                          defaultValue={participant.prenom}
                          onChange={(e) => {
                            if (editingParticipant) {
                              setEditingParticipant({
                                ...editingParticipant,
                                prenom: e.target.value
                              });
                            }
                          }}
                        />
                        <Input
                          placeholder="Nom"
                          defaultValue={participant.nom}
                          onChange={(e) => {
                            if (editingParticipant) {
                              setEditingParticipant({
                                ...editingParticipant,
                                nom: e.target.value
                              });
                            }
                          }}
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => editingParticipant && handleEdit(editingParticipant)}
                      >
                        Sauvegarder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(participant.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};