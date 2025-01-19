import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import QuestionBankSelector from '../question-bank/QuestionBankSelector';
import QuestionsList from '../questions/QuestionsList';
import CreateUrlQuestion from '../question-bank/CreateUrlQuestion';

const ContestQuestionManager = () => {
  const { contestId } = useParams();
  const [activeTab, setActiveTab] = useState('existing');

  const { data: contest } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!contestId,
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des questions - {contest?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="existing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="existing">Questions existantes</TabsTrigger>
              <TabsTrigger value="bank">Banque de questions</TabsTrigger>
              <TabsTrigger value="url">Créer depuis une URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing">
              {contestId && <QuestionsList contestId={contestId} />}
            </TabsContent>
            
            <TabsContent value="bank">
              {contestId && <QuestionBankSelector contestId={contestId} onQuestionSelect={() => {}} selectedQuestions={[]} />}
            </TabsContent>
            
            <TabsContent value="url">
              {contestId && <CreateUrlQuestion contestId={contestId} />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestQuestionManager;