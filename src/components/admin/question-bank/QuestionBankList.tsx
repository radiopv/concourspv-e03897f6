import { QuestionBankItem } from "@/types/question";
import { QuestionCard } from "./QuestionCard";
import { useState } from "react";

interface QuestionBankListProps {
  questions: QuestionBankItem[];
}

export const QuestionBankList = ({ questions }: QuestionBankListProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const toggleSelection = (questionId: string) => {
    const newSelection = new Set(selectedQuestions);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestions(newSelection);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question dans la banque</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {questions.map((question) => (
        <QuestionCard 
          key={question.id} 
          question={question}
          isSelected={selectedQuestions.has(question.id)}
          onSelect={() => toggleSelection(question.id)}
        />
      ))}
    </div>
  );
};