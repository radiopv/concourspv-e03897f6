import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { supabase } from "../../App";
import { validateAndParseQuestions } from "../../utils/excelImport";

const ExcelImportForm = () => {
  const { toast } = useToast();

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
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: `Concours importé le ${new Date().toLocaleDateString()}`,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'draft'
          }])
          .select();

        if (contestError) throw contestError;

        // Ajouter les questions au concours
        const questionsData = questions.map((q, index) => ({
          contest_id: contest[0].id,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          order_number: index + 1,
          type: 'multiple_choice' // Adding the required type field
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
  );
};

export default ExcelImportForm;