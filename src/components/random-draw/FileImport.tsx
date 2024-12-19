import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileImportProps {
  onParticipantsImported: (participants: Participant[]) => void;
}

interface Participant {
  nom: string;
  prenom: string;
  id: string;
}

export const FileImport = ({ onParticipantsImported }: FileImportProps) => {
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

        console.log('Raw Excel Data:', jsonData); // Debug log

        // Map column names to standardized format with more variations
        const participants = jsonData.map(row => {
          // Get the first non-empty value from possible column names
          const nom = row.nom || row.Nom || row.NOM || row.name || row.Name || row.NAME || '';
          const prenom = row.prenom || row.Prenom || row.PRENOM || row.firstname || row.Firstname || row.FirstName || '';
          
          console.log('Mapping row:', row, 'to:', { nom, prenom }); // Debug log

          return {
            nom: nom.toString().trim(),
            prenom: prenom.toString().trim(),
            id: crypto.randomUUID()
          };
        }).filter(p => p.nom || p.prenom); // Filter out empty entries

        // Remove duplicates based on both nom and prenom
        const uniqueParticipants = Array.from(
          new Map(
            participants.map(item => [
              `${item.nom.toLowerCase()}-${item.prenom.toLowerCase()}`,
              item
            ])
          ).values()
        );

        console.log('Unique Participants:', uniqueParticipants); // Debug log

        if (uniqueParticipants.length === 0) {
          toast({
            title: "Erreur",
            description: "Aucun participant trouvé dans le fichier. Vérifiez les noms des colonnes (nom/prenom).",
            variant: "destructive",
          });
          return;
        }

        onParticipantsImported(uniqueParticipants);
        toast({
          title: "Fichier importé avec succès",
          description: `${uniqueParticipants.length} participants uniques chargés`,
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier Excel. Vérifiez le format du fichier.",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
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
        </div>
      </CardContent>
    </Card>
  );
};