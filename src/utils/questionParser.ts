interface ParsedQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

export const parseQuestionText = (text: string): ParsedQuestion | null => {
  try {
    // Extraire la question
    const questionMatch = text.match(/Question:\s*(.*?)(?=\n|$)/);
    if (!questionMatch) return null;
    const question_text = questionMatch[1].trim();

    // Extraire les options
    const optionsMatch = text.match(/Réponses proposées:\s*([\s\S]*?)(?=\n\s*Réponse correcte:|$)/);
    if (!optionsMatch) return null;
    const options = optionsMatch[1]
      .split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    // Extraire la réponse correcte
    const correctMatch = text.match(/Réponse correcte:\s*(.*?)(?=\n|$)/);
    if (!correctMatch) return null;
    const correct_answer = correctMatch[1].trim();

    // Extraire l'URL de l'article (optionnel)
    const urlMatch = text.match(/URL de l'article:\s*(https?:\/\/[^\s\[]+)/);
    const article_url = urlMatch ? urlMatch[1].trim() : undefined;

    return {
      question_text,
      options,
      correct_answer,
      article_url
    };
  } catch (error) {
    console.error('Error parsing question text:', error);
    return null;
  }
};