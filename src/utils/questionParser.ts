interface ParsedQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
}

const cleanText = (text: string): string => {
  return text.replace(/^\d+\.\s*/, '').trim();
};

export const parseQuestionText = (text: string): ParsedQuestion[] => {
  const questions: ParsedQuestion[] = [];
  
  // Séparer les questions (par "Question" ou "Question X :")
  const questionBlocks = text.split(/Question(?:\s+\d+\s*:|\s*:|\s*$)/g).filter(block => block.trim());
  
  for (const block of questionBlocks) {
    try {
      // Extraire l'URL source
      const sourceMatch = block.match(/Source\s*:\s*(https?:\/\/[^\s\n]+)/i);
      const article_url = sourceMatch ? sourceMatch[1].trim() : undefined;

      // Extraire la question
      const questionMatch = block.match(/Question\s*:?\s*([^\n]+)/i) || 
                          block.match(/([^\n]+\?)/);
      if (!questionMatch) continue;
      const question_text = questionMatch[1].trim();

      // Extraire les options
      const optionsMatch = block.match(/Réponses proposées\s*:\s*([\s\S]*?)(?=\s*Réponse correcte|$)/i);
      if (!optionsMatch) continue;
      const options = optionsMatch[1]
        .split('\n')
        .map(opt => cleanText(opt))
        .filter(opt => opt.length > 0);

      // Extraire la réponse correcte
      const correctMatch = block.match(/Réponse correcte\s*:\s*(?:\d+\.\s*)?([^\n]+)/i);
      if (!correctMatch) continue;
      let correct_answer = correctMatch[1].trim();

      // Si la réponse correcte contient un numéro, prendre l'option correspondante
      const numberMatch = correct_answer.match(/^(\d+)\./);
      if (numberMatch) {
        const index = parseInt(numberMatch[1]) - 1;
        if (options[index]) {
          correct_answer = cleanText(options[index]);
        }
      }

      questions.push({
        question_text,
        options,
        correct_answer,
        article_url
      });
    } catch (error) {
      console.error('Error parsing question block:', error);
      continue;
    }
  }

  return questions;
};