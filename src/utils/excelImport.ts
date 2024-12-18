import * as XLSX from 'xlsx';

export interface QuestionImport {
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

export const validateAndParseQuestions = (worksheet: XLSX.WorkSheet): QuestionImport[] => {
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  if (jsonData.length === 0) {
    throw new Error("Le fichier est vide");
  }

  const requiredColumns = ['Question', 'Choix A', 'Choix B', 'Choix C', 'Choix D', 'Réponse correcte'];
  const firstRow = jsonData[0] as Record<string, unknown>;
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes dans le fichier : ${missingColumns.join(', ')}`);
  }

  return jsonData.map((row: any) => ({
    question_text: row['Question'],
    options: [
      row['Choix A'],
      row['Choix B'],
      row['Choix C'],
      row['Choix D']
    ],
    correct_answer: row['Réponse correcte'],
    article_url: row['Lien Article'] || null
  }));
};