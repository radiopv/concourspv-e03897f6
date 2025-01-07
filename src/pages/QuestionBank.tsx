import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../App';
import { QuestionBankList } from '@/components/admin/question-bank/QuestionBankList';
import AddQuestionForm from '@/components/admin/question-bank/AddQuestionForm';

export interface QuestionBankItem {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url?: string;
  status: 'available' | 'used';
}

const QuestionBank = () => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching question bank:', error);
        throw error;
      }

      return data as QuestionBankItem[];
    }
  });

  if (isLoading) {
    return <div>Chargement de la banque de questions...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Banque de Questions</h1>
      </div>

      <AddQuestionForm />
      
      <QuestionBankList questions={questions} />
    </div>
  );
};

export default QuestionBank;