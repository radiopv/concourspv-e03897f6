import { QuestionBankItem } from "@/pages/QuestionBank";
import { QuestionCard } from "./QuestionCard";

interface QuestionBankListProps {
  questions: QuestionBankItem[];
}

export const QuestionBankList = ({ questions }: QuestionBankListProps) => {
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
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
};