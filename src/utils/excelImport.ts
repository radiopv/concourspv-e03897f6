import * as XLSX from 'xlsx';

export interface QuestionImport {
  question: string;
  choix_a: string;
  choix_b: string;
  choix_c: string;
  choix_d: string;
  reponse_correcte: string;
}

export const validateAndParseQuestions = (worksheet: XLSX.WorkSheet): QuestionImport[] => {
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  if (jsonData.length === 0) {
    throw new Error("Le fichier est vide");
  }

  // Vérifier les colonnes requises
  const requiredColumns = ['Question', 'Choix A', 'Choix B', 'Choix C', 'Choix D', 'Réponse correcte'];
  const firstRow = jsonData[0] as Record<string, unknown>;
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes dans le fichier : ${missingColumns.join(', ')}`);
  }

  return jsonData.map((row: any, index: number) => {
    // Vérifier les valeurs manquantes
    for (const col of requiredColumns) {
      if (!row[col]) {
        throw new Error(`La ligne ${index + 1} a une valeur manquante pour la colonne '${col}'`);
      }
    }

    return {
      question: row['Question'],
      choix_a: row['Choix A'],
      choix_b: row['Choix B'],
      choix_c: row['Choix C'],
      choix_d: row['Choix D'],
      reponse_correcte: row['Réponse correcte']
    };
  });
};