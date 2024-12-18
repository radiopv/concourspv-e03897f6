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
    end_date: "",
  });
  const { toast } = useToast();

  const handleCreateContest = async () => {
    try {
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
          description: newContest.description,
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

        const contestData = jsonData.map((row: any) => ({
          title: row.title,
          description: row.description,
          end_date: row.end_date,
          status: 'active'
        }));

        const { error } = await supabase
          .from('contests')
          .insert(contestData);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Les concours ont été importés avec succès",
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importing contests:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'importation des concours",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau concours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={newContest.title}
            onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
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
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={newContest.end_date}
            onChange={(e) => setNewContest({ ...newContest, end_date: e.target.value })}
          />
        </div>
        <Button onClick={handleCreateContest} className="w-full">
          Créer le concours
        </Button>
        <div className="mt-4">
          <Label htmlFor="file-upload">Importer des concours (CSV/Excel)</Label>
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