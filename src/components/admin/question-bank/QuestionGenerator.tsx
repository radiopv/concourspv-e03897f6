import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const QuestionGenerator = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data: generatedData, error: functionError } = await supabase.functions
        .invoke('generate-questions', {
          body: { topic, count },
        });

      if (functionError) throw functionError;

      console.log('Generated questions:', generatedData);

      // Save questions to question bank
      const { error: insertError } = await supabase
        .from('question_bank')
        .insert(
          generatedData.questions.map((q: any) => ({
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            status: 'available'
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: `${generatedData.questions.length} questions ont été générées et ajoutées à la banque de questions`,
      });

      setTopic('');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer des questions avec Grok-2</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="topic">Sujet</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Histoire de France, Mathématiques, etc."
          />
        </div>
        <div>
          <Label htmlFor="count">Nombre de questions</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            'Générer des questions'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionGenerator;