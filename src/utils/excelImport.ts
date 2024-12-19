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

  const firstRow = jsonData[0] as Record<string, unknown>;
  
  // Définir les variations possibles des noms de colonnes
  const columnMappings = {
    'Question': ['Question', 'question', 'QUESTION', 'question_text', 'Question Text'],
    'Option A': ['Option A', 'Choix A', 'choix a', 'CHOIX A', 'optionA', 'option_a'],
    'Option B': ['Option B', 'Choix B', 'choix b', 'CHOIX B', 'optionB', 'option_b'],
    'Option C': ['Option C', 'Choix C', 'choix c', 'CHOIX C', 'optionC', 'option_c'],
    'Option D': ['Option D', 'Choix D', 'choix d', 'CHOIX D', 'optionD', 'option_d'],
    'Réponse': ['Réponse', 'Réponse correcte', 'reponse', 'REPONSE', 'Bonne réponse', 'correct_answer'],
    'Article': ['Article', 'Lien Article', 'article_url', 'URL', 'lien']
  };

  // Trouver les noms réels des colonnes dans le fichier
  const getColumnName = (variations: string[]): string | undefined => {
    return Object.keys(firstRow).find(key =>
      variations.some(variation => 
        key.toLowerCase().trim() === variation.toLowerCase().trim()
      )
    );
  };

  // Vérifier les colonnes requises
  const missingColumns = [];
  for (const [requiredColumn, variations] of Object.entries(columnMappings)) {
    if (!getColumnName(variations) && requiredColumn !== 'Article') {
      missingColumns.push(requiredColumn);
    }
  }

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes dans le fichier : ${missingColumns.join(', ')}`);
  }

  // Mapper les données
  return jsonData.map((row: any) => {
    const questionColumn = getColumnName(columnMappings['Question']) || 'Question';
    const optionAColumn = getColumnName(columnMappings['Option A']) || 'Option A';
    const optionBColumn = getColumnName(columnMappings['Option B']) || 'Option B';
    const optionCColumn = getColumnName(columnMappings['Option C']) || 'Option C';
    const optionDColumn = getColumnName(columnMappings['Option D']) || 'Option D';
    const reponseColumn = getColumnName(columnMappings['Réponse']) || 'Réponse';
    const articleColumn = getColumnName(columnMappings['Article']);

    return {
      question_text: row[questionColumn],
      options: [
        row[optionAColumn],
        row[optionBColumn],
        row[optionCColumn],
        row[optionDColumn]
      ],
      correct_answer: row[reponseColumn],
      article_url: articleColumn ? row[articleColumn] : null
    };
  });
};