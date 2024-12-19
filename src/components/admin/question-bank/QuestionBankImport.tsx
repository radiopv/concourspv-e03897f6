import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";
import { validateAndParseQuestions } from "../../../utils/excelImport";
import { useQueryClient } from "@tanstack/react-query";

const QuestionBankImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const questions = validateAndParseQuestions(worksheet);

        // Ajouter les questions au concours existant avec l'URL de l'article
        const questionsData = questions.map((q, index) => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          article_url: q.article_url,
          order_number: index + 1,
          type: 'multiple_choice'
        }));

        const { error: questionsError } = await supabase
          .from('question_bank')
          .insert(questionsData);

        if (questionsError) throw questionsError;

        await queryClient.invalidateQueries({ queryKey: ['question-bank'] });

        toast({
          title: "Succès",
          description: `${questions.length} questions ont été importées avec succès.`,
        });

        if (event.target) {
          event.target.value = '';
        }
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
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mt-4">
      <Label htmlFor="file-upload">Importer des questions (Excel)</Label>
      <p className="text-sm text-gray-500 mb-2">
        Le fichier doit contenir les colonnes: Question, Choix A, Choix B, Choix C, Choix D, Réponse correcte, Lien Article (optionnel)
      </p>
      <Input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={isImporting}
        className="mt-2"
      />
    </div>
  );
};

export default QuestionBankImport;
