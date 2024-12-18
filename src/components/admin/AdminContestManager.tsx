import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { supabase } from "../../App";
import { validateAndParseQuestions, type QuestionImport } from "../../utils/excelImport";

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

      const { data: contest, error: contestError } = await supabase
        .from('contests')
        .insert([{
          title: newContest.title,
          description: newContest.description || null,
          start_date: newContest.start_date,
          end_date: newContest.end_date,
          status: 'active'
        }])
        .select();

      if (contestError) throw contestError;

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
        
        const questions = validateAndParseQuestions(worksheet);

        // Créer un nouveau concours avec les questions
        const { data: contest, error: contestError } = await supabase
          .from('contests')
          .insert([{
            title: file.name.replace(/\.[^/.]+$/, ""), // Utilise le nom du fichier comme titre
            description: `Concours importé le ${new Date().toLocaleDateString()}`,
            start_date: new Date().toISOString(), // Date actuelle
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours par défaut
            status: 'draft' // Statut brouillon par défaut
          }])
          .select();

        if (contestError) throw contestError;

        // Ajouter les questions au concours
        const questionsData = questions.map((q: QuestionImport) => ({
          contest_id: contest[0].id,
          question: q.question,
          choices: [q.choix_a, q.choix_b, q.choix_c, q.choix_d],
          correct_answer: q.reponse_correcte
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsData);

        if (questionsError) throw questionsError;

        toast({
          title: "Succès",
          description: `${questions.length} questions ont été importées avec succès. Le concours est en mode brouillon.`,
        });

        event.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importing questions:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'importation des questions",
        variant: "destructive",
      });
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
          <Label htmlFor="file-upload">Importer des questions (Excel)</Label>
          <p className="text-sm text-gray-500 mb-2">
            Le fichier doit contenir les colonnes: Question, Choix A, Choix B, Choix C, Choix D, Réponse correcte
          </p>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminContestManager;