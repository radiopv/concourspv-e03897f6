import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionBankImport from "./QuestionBankImport";
import AddQuestionForm from "./AddQuestionForm";
import QuestionsList from "./QuestionsList";
import QuickAddQuestion from "./QuickAddQuestion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestionBankManager = () => {
  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="quick-add">
        <TabsList>
          <TabsTrigger value="quick-add">Ajout rapide</TabsTrigger>
          <TabsTrigger value="import">Import URL</TabsTrigger>
          <TabsTrigger value="manual">Ajout manuel</TabsTrigger>
        </TabsList>
        <TabsContent value="quick-add">
          <QuickAddQuestion />
        </TabsContent>
        <TabsContent value="import">
          <QuestionBankImport />
        </TabsContent>
        <TabsContent value="manual">
          <AddQuestionForm />
        </TabsContent>
      </Tabs>
      <QuestionsList />
    </div>
  );
};

export default QuestionBankManager;