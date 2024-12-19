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
  
  // Define all possible variations of column names
  const columnMappings = {
    'Question': ['Question', 'question', 'QUESTION', 'question_text', 'Question Text'],
    'Choix A': ['Choix A', 'choix a', 'CHOIX A', 'Option A', 'Option 1', 'Réponse A', 'A'],
    'Choix B': ['Choix B', 'choix b', 'CHOIX B', 'Option B', 'Option 2', 'Réponse B', 'B'],
    'Choix C': ['Choix C', 'choix c', 'CHOIX C', 'Option C', 'Option 3', 'Réponse C', 'C'],
    'Choix D': ['Choix D', 'choix d', 'CHOIX D', 'Option D', 'Option 4', 'Réponse D', 'D'],
    'Réponse correcte': ['Réponse correcte', 'reponse correcte', 'Bonne réponse', 'Réponse', 'REPONSE CORRECTE', 'Correct Answer', 'Answer'],
    'Lien Article': ['Lien Article', 'lien article', 'URL', 'Article URL', 'LIEN ARTICLE', 'Source']
  };

  // Find actual column names in the file
  const actualColumns: Record<string, string> = {};
  
  for (const [requiredColumn, variations] of Object.entries(columnMappings)) {
    const foundColumn = Object.keys(firstRow).find(key => 
      variations.some(variation => 
        key.toLowerCase().trim() === variation.toLowerCase().trim()
      )
    );
    
    if (foundColumn) {
      actualColumns[requiredColumn] = foundColumn;
    } else if (requiredColumn !== 'Lien Article') { // Article URL is optional
      throw new Error(`Colonnes manquantes dans le fichier : ${requiredColumn}\n\nLes noms de colonnes acceptés sont :\n${variations.join(', ')}`);
    }
  }

  return jsonData.map((row: any, index: number) => {
    // Validate required fields
    if (!row[actualColumns['Question']]) {
      throw new Error(`Ligne ${index + 1}: Question manquante`);
    }

    const options = [
      row[actualColumns['Choix A']],
      row[actualColumns['Choix B']],
      row[actualColumns['Choix C']],
      row[actualColumns['Choix D']]
    ];

    if (options.some(option => !option)) {
      throw new Error(`Ligne ${index + 1}: Tous les choix de réponse sont obligatoires`);
    }

    if (!row[actualColumns['Réponse correcte']]) {
      throw new Error(`Ligne ${index + 1}: Réponse correcte manquante`);
    }

    return {
      question_text: row[actualColumns['Question']],
      options: options,
      correct_answer: row[actualColumns['Réponse correcte']],
      article_url: actualColumns['Lien Article'] ? row[actualColumns['Lien Article']] : null
    };
  });
};