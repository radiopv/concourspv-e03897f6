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
  
  // Format 1: Question X: ... A) ... B) ... C) ... D) ... Réponse correcte: ...
  // Format 2: Question: ... Réponses proposées: ... Réponse correcte: ...
  const questionBlocks = text.split(/(?=Question(?:\s+\d+\s*:|\s*:))/g).filter(block => block.trim());
  
  for (const block of questionBlocks) {
    try {
      // Extract source URL from anywhere in the text
      const urlMatch = block.match(/https?:\/\/[^\s\n]+/);
      const article_url = urlMatch ? urlMatch[0].trim() : undefined;

      // Extract question text
      const questionMatch = block.match(/Question(?:\s+\d+)?:?\s*([^\n]+)/i) || 
                          block.match(/([^\n]+\?)/);
      if (!questionMatch) continue;
      const question_text = questionMatch[1].trim();

      // Try different formats for options
      let options: string[] = [];
      
      // Format 1: A) B) C) D)
      const letterOptions = block.match(/[A-D]\)\s*([^\n]+)/g);
      if (letterOptions) {
        options = letterOptions.map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
      } else {
        // Format 2: Line by line after "Réponses proposées:"
        const optionsMatch = block.match(/Réponses proposées\s*:\s*([\s\S]*?)(?=\s*Réponse correcte|$)/i);
        if (optionsMatch) {
          options = optionsMatch[1]
            .split('\n')
            .map(opt => cleanText(opt))
            .filter(opt => opt.length > 0);
        }
      }

      // Extract correct answer
      let correct_answer = '';
      const correctMatch = block.match(/Réponse correcte\s*:\s*(?:[A-D]\)\s*)?([^\n]+)/i);
      if (correctMatch) {
        correct_answer = correctMatch[1].trim();
        // If the answer contains a letter (A, B, C, D), get the corresponding option
        const letterMatch = correct_answer.match(/^([A-D])\)/);
        if (letterMatch && options.length >= 4) {
          const index = letterMatch[1].charCodeAt(0) - 65; // Convert A->0, B->1, etc.
          correct_answer = options[index];
        }
      }

      // Only add if we have all required fields
      if (question_text && options.length > 0 && correct_answer) {
        questions.push({
          question_text,
          options,
          correct_answer,
          article_url
        });
      }
    } catch (error) {
      console.error('Error parsing question block:', error);
      continue;
    }
  }

  return questions;
};