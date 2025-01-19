import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionBankImport from "./QuestionBankImport";
import AddQuestionForm from "./AddQuestionForm";
import QuestionsList from "./QuestionsList";
import QuickAddQuestion from "./QuickAddQuestion";
import QuestionTableView from "./QuestionTableView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestionBankManager = () => {
  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="table">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="table">Vue Tableau</TabsTrigger>
          <TabsTrigger value="quick-add">Ajout rapide</TabsTrigger>
          <TabsTrigger value="import">Import URL</TabsTrigger>
          <TabsTrigger value="manual">Ajout manuel</TabsTrigger>
          <TabsTrigger value="list">Liste détaillée</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <QuestionTableView />
        </TabsContent>

        <TabsContent value="quick-add">
          <QuickAddQuestion />
        </TabsContent>
        
        <TabsContent value="import">
          <QuestionBankImport />
        </TabsContent>
        
        <TabsContent value="manual">
          <AddQuestionForm />
        </TabsContent>

        <TabsContent value="list">
          <QuestionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionBankManager;