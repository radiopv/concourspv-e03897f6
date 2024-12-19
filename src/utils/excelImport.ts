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
  console.log("Colonnes disponibles dans le fichier Excel:", Object.keys(firstRow));

  // Définir les variations de noms de colonnes acceptées
  const columnMappings = {
    'Question': ['Question', 'question', 'QUESTION'],
    'Choix 1': ['Choix 1', 'choix 1', 'CHOIX 1'],
    'Choix 2': ['Choix 2', 'choix 2', 'CHOIX 2'],
    'Choix 3': ['Choix 3', 'choix 3', 'CHOIX 3'],
    'Choix 4': ['Choix 4', 'choix 4', 'CHOIX 4'],
    'Bonne réponse': ['Bonne réponse', 'bonne reponse', 'BONNE REPONSE', 'Bonne reponse'],
    'Lien de l\'article': ['Lien de l\'article', 'lien de l\'article', 'Lien article', 'lien article']
  };

  // Trouver les noms de colonnes actuels dans le fichier
  const actualColumns: Record<string, string> = {};
  
  for (const [requiredColumn, variations] of Object.entries(columnMappings)) {
    const foundColumn = Object.keys(firstRow).find(key => 
      variations.includes(key)
    );
    
    if (foundColumn) {
      actualColumns[requiredColumn] = foundColumn;
    } else if (requiredColumn !== 'Lien de l\'article') { // L'URL de l'article est optionnelle
      throw new Error(`Colonne manquante dans le fichier : ${requiredColumn}\n\nLes noms de colonnes acceptés sont :\n${variations.join(', ')}`);
    }
  }

  console.log("Colonnes mappées:", actualColumns);

  return jsonData.map((row: any, index: number) => {
    // Valider les champs requis
    if (!row[actualColumns['Question']]) {
      throw new Error(`Ligne ${index + 1}: Question manquante`);
    }

    const options = [
      row[actualColumns['Choix 1']],
      row[actualColumns['Choix 2']],
      row[actualColumns['Choix 3']],
      row[actualColumns['Choix 4']]
    ];

    if (options.some(option => !option)) {
      throw new Error(`Ligne ${index + 1}: Tous les choix de réponse sont obligatoires`);
    }

    if (!row[actualColumns['Bonne réponse']]) {
      throw new Error(`Ligne ${index + 1}: Réponse correcte manquante`);
    }

    return {
      question_text: row[actualColumns['Question']],
      options: options,
      correct_answer: row[actualColumns['Bonne réponse']],
      article_url: actualColumns['Lien de l\'article'] ? row[actualColumns['Lien de l\'article']] : null
    };
  });
};