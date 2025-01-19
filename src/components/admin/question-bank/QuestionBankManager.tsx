import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionBankList from "./QuestionBankList";
import AddQuestionForm from "./AddQuestionForm";
import { supabase } from "@/lib/supabase";
import QuestionBankImport from "./QuestionBankImport";
import QuestionsList from "./QuestionsList";
import CreateUrlQuestion from "./CreateUrlQuestion";

const QuestionBankManager = () => {
  return (
    <div className="space-y-6 p-6">
      <CreateUrlQuestion />
      <QuestionBankImport />
      <AddQuestionForm />
      <QuestionsList />
    </div>
  );
};

export default QuestionBankManager;