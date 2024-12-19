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
    'Question': ['Question', 'question', 'QUESTION'],
    'Choix A': ['Choix A', 'choix a', 'CHOIX A', 'Option A'],
    'Choix B': ['Choix B', 'choix b', 'CHOIX B', 'Option B'],
    'Choix C': ['Choix C', 'choix c', 'CHOIX C', 'Option C'],
    'Choix D': ['Choix D', 'choix d', 'CHOIX D', 'Option D'],
    'Réponse correcte': ['Réponse correcte', 'reponse correcte', 'Bonne réponse', 'Réponse', 'REPONSE CORRECTE'],
    'Lien Article': ['Lien Article', 'lien article', 'URL', 'Article URL', 'LIEN ARTICLE']
  };

  // Vérifier chaque colonne requise
  const missingColumns = [];
  for (const [requiredColumn, variations] of Object.entries(columnMappings)) {
    if (!variations.some(variation => 
      Object.keys(firstRow).some(key => 
        key.toLowerCase().trim() === variation.toLowerCase().trim()
      )
    )) {
      if (requiredColumn !== 'Lien Article') { // Le lien d'article est optionnel
        missingColumns.push(requiredColumn);
      }
    }
  }

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes dans le fichier : ${missingColumns.join(', ')}`);
  }

  // Trouver les noms réels des colonnes dans le fichier
  const getColumnName = (variations: string[]): string => {
    const columnName = Object.keys(firstRow).find(key =>
      variations.some(variation => 
        key.toLowerCase().trim() === variation.toLowerCase().trim()
      )
    );
    return columnName || variations[0];
  };

  return jsonData.map((row: any) => {
    const questionColumn = getColumnName(columnMappings['Question']);
    const choixAColumn = getColumnName(columnMappings['Choix A']);
    const choixBColumn = getColumnName(columnMappings['Choix B']);
    const choixCColumn = getColumnName(columnMappings['Choix C']);
    const choixDColumn = getColumnName(columnMappings['Choix D']);
    const reponseColumn = getColumnName(columnMappings['Réponse correcte']);
    const lienColumn = getColumnName(columnMappings['Lien Article']);

    return {
      question_text: row[questionColumn],
      options: [
        row[choixAColumn],
        row[choixBColumn],
        row[choixCColumn],
        row[choixDColumn]
      ],
      correct_answer: row[reponseColumn],
      article_url: row[lienColumn] || null
    };
  });
};