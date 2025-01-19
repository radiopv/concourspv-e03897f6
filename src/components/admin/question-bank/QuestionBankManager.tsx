import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionBankList from "./QuestionBankList";
import AddQuestionForm from "./AddQuestionForm";
import QuestionBankImport from "./QuestionBankImport";
import QuestionsList from "./QuestionsList";

const QuestionBankManager = () => {
  return (
    <div className="space-y-6 p-6">
      <QuestionBankImport />
      <AddQuestionForm />
      <QuestionsList />
    </div>
  );
};

export default QuestionBankManager;