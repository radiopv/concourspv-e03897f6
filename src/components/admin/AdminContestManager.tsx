import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { supabase } from "../../App";

const AdminContestManager = () => {
  const [newContest, setNewContest] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const { toast } = useToast();

  const handleCreateContest = async () => {
    try {
      // Validate required fields
      if (!newContest.title || !newContest.start_date || !newContest.end_date) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires (titre, date de début et date de fin)",
          variant: "destructive",
        });
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un concours",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('contests')
        .insert([{
          title: newContest.title,
          description: newContest.description || null,
          start_date: newContest.start_date,
          end_date: newContest.end_date,
          status: 'active'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le concours a été créé avec succès",
      });

      setNewContest({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      console.error('Error creating contest:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du concours",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // First, check if the file is empty
        if (jsonData.length === 0) {
          throw new Error("Le fichier est vide");
        }

        // Check if all required columns exist in the first row
        const firstRow = jsonData[0] as Record<string, unknown>;
        const requiredColumns = ['title', 'start_date', 'end_date'];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          throw new Error(`Colonnes manquantes dans le fichier : ${missingColumns.join(', ')}`);
        }

        // Validate and transform the data
        const contestData = jsonData.map((row: any, index: number) => {
          // Check for empty required fields
          for (const col of requiredColumns) {
            if (!row[col]) {
              throw new Error(`La ligne ${index + 1} a une valeur manquante pour la colonne '${col}'`);
            }
          }

          return {
            title: row.title,
            description: row.description || null,
            start_date: row.start_date,
            end_date: row.end_date,
            status: 'active'
          };
        });

        const { error } = await supabase
          .from('contests')
          .insert(contestData);

        if (error) throw error;

        toast({
          title: "Succès",
          description: `${contestData.length} concours ont été importés avec succès`,
        });

        // Reset the file input
        event.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importing contests:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'importation des concours",
        variant: "destructive",
      });
      // Reset the file input on error
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau concours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={newContest.title}
            onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newContest.description}
            onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="start_date">Date de début *</Label>
          <Input
            id="start_date"
            type="date"
            value={newContest.start_date}
            onChange={(e) => setNewContest({ ...newContest, start_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">Date de fin *</Label>
          <Input
            id="end_date"
            type="date"
            value={newContest.end_date}
            onChange={(e) => setNewContest({ ...newContest, end_date: e.target.value })}
            required
          />
        </div>
        <Button onClick={handleCreateContest} className="w-full">
          Créer le concours
        </Button>
        <div className="mt-4">
          <Label htmlFor="file-upload">Importer des concours (CSV/Excel)</Label>
          <p className="text-sm text-gray-500 mb-2">
            Le fichier doit contenir les colonnes: title, start_date, end_date (obligatoires) et description (optionnelle)
          </p>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminContestManager;