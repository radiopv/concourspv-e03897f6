import { QuestionBankItem } from "@/types/question";
import { QuestionCard } from "./QuestionCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionBankListProps {
  questions: QuestionBankItem[];
  onAddToContest?: (questions: QuestionBankItem[]) => void;
}

export const QuestionBankList = ({ questions, onAddToContest }: QuestionBankListProps) => {
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

  const handleAddToContest = () => {
    if (onAddToContest) {
      const selectedQuestionsList = questions.filter(q => selectedQuestions.has(q.id));
      onAddToContest(selectedQuestionsList);
      setSelectedQuestions(new Set());
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune question disponible dans la banque</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onAddToContest && selectedQuestions.size > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleAddToContest}>
            Ajouter {selectedQuestions.size} question{selectedQuestions.size > 1 ? 's' : ''} au concours
          </Button>
        </div>
      )}
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
    </div>
  );
};