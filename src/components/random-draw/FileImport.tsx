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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

        console.log('Données Excel brutes:', jsonData);

        // Trouver les colonnes appropriées
        const firstRow = jsonData[0] || {};
        const columns = Object.keys(firstRow);
        console.log('Colonnes trouvées:', columns);

        // Traiter les données pour extraire nom et prénom
        const participants = jsonData.map(row => {
          let fullName = '';

          // Chercher la colonne qui contient le nom complet
          const nameColumn = columns.find(col => 
            col.toLowerCase() === 'name' || 
            col.toLowerCase() === 'nom' ||
            col.toLowerCase().includes('name') ||
            col.toLowerCase().includes('nom')
          );

          if (nameColumn) {
            fullName = row[nameColumn]?.toString().trim() || '';
          }

          if (!fullName) return null;

          // Séparer le nom complet en prénom et nom
          const nameParts = fullName.split(' ');
          let prenom = '';
          let nom = '';

          if (nameParts.length === 1) {
            // Si un seul mot, on le considère comme prénom
            prenom = nameParts[0];
          } else {
            // Le premier mot est le prénom, le reste est le nom
            prenom = nameParts[0];
            nom = nameParts.slice(1).join(' ');
          }

          return {
            nom,
            prenom,
            id: crypto.randomUUID()
          };
        }).filter((p): p is NonNullable<typeof p> => p !== null);

        console.log('Participants avant dédoublonnage:', participants.length);

        // Supprimer les doublons
        const uniqueParticipants = Array.from(
          new Map(
            participants.map(item => [
              `${item.nom.toLowerCase()}-${item.prenom.toLowerCase()}`,
              item
            ])
          ).values()
        );

        console.log('Participants après dédoublonnage:', uniqueParticipants.length);

        if (uniqueParticipants.length === 0) {
          toast({
            title: "Erreur",
            description: "Aucun participant trouvé dans le fichier. Vérifiez le format du fichier.",
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
        console.error('Erreur lors de la lecture du fichier Excel:', error);
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