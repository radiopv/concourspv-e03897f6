import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Participant {
  nom: string;
  prenom: string;
}

const RandomDraw = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Traiter et dédupliquer les données
        const uniqueParticipants = Array.from(new Set(
          jsonData.map(row => JSON.stringify({
            nom: row.nom || row.Nom || row.NOM,
            prenom: row.prenom || row.Prenom || row.PRENOM
          }))
        )).map(str => JSON.parse(str));

        setParticipants(uniqueParticipants);
        toast({
          title: "Fichier importé avec succès",
          description: `${uniqueParticipants.length} participants uniques chargés`,
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier Excel",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import des Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="mb-4"
            />
            <p className="text-sm text-gray-500">
              Participants chargés : {participants.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Liste des Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={index} className="py-2 border-b last:border-0">
                {participant.prenom} {participant.nom}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tirage au Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={performDraw}
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
    </div>
  );
};

export default RandomDraw;