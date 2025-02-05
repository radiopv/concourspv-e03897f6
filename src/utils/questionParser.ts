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
  
  // Split text into question blocks
  const questionBlocks = text.split(/(?=\d+\.\s*|Question(?:\s+\d+)?:)/g)
    .filter(block => block.trim());
  
  for (const block of questionBlocks) {
    try {
      // Extract source URL from anywhere in the text
      const urlMatch = block.match(/https?:\/\/[^\s\n]+/);
      const article_url = urlMatch ? urlMatch[0].trim() : undefined;

      // Extract question text - now handles numbered format "1." and "Question:" format
      const questionMatch = block.match(/(?:\d+\.|Question(?:\s+\d+)?:)?\s*([^\n]+\??)/i);
      if (!questionMatch) continue;
      const question_text = questionMatch[1].trim();

      // Extract options - now handles both A) and regular list formats
      let options: string[] = [];
      const letterOptions = block.match(/[A-D]\)\s*([^\n]+)/g);
      
      if (letterOptions) {
        options = letterOptions.map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
      } else {
        // Try alternative format with dashes or numbers
        const altOptions = block.match(/(?:[-•*]\s|\d+\.\s)([^\n]+)/g);
        if (altOptions) {
          options = altOptions.map(opt => opt.replace(/(?:[-•*]|\d+\.)\s/, '').trim());
        }
      }

      // Extract correct answer - now handles ✅ and "Bonne réponse :" formats
      let correct_answer = '';
      const checkmarkMatch = block.match(/✅[^A-D]*([A-D]\)[^"\n]+)/);
      const bonneReponseMatch = block.match(/(?:Bonne réponse|Réponse correcte)\s*:?\s*(?:[A-D]\))?\s*([^\n]+)/i);
      
      if (checkmarkMatch) {
        correct_answer = checkmarkMatch[1].replace(/^[A-D]\)\s*/, '').trim();
      } else if (bonneReponseMatch) {
        correct_answer = bonneReponseMatch[1].trim();
      }

      // Remove any quotes around the correct answer
      correct_answer = correct_answer.replace(/^["']|["']$/g, '');

      // Only add if we have all required fields and exactly 4 options
      if (question_text && options.length === 4 && correct_answer) {
        // Make sure the correct answer matches one of the options exactly
        const matchingOption = options.find(opt => opt === correct_answer);
        if (!matchingOption) {
          // If no exact match, try to find the option that contains the correct answer
          const containingOption = options.find(opt => 
            opt.toLowerCase().includes(correct_answer.toLowerCase()) ||
            correct_answer.toLowerCase().includes(opt.toLowerCase())
          );
          if (containingOption) {
            correct_answer = containingOption;
          }
        }

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