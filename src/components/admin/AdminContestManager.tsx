import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import ExcelImportForm from "./ExcelImportForm";

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
        
        <ExcelImportForm />
      </CardContent>
    </Card>
  );
};

export default AdminContestManager;