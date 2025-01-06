import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContestAI } from '@/hooks/useContestAI';
import { Wand2 } from 'lucide-react';

export const ContestAIAssistant = () => {
  const [theme, setTheme] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const { isLoading, suggestContest, generateContent } = useContestAI();

  const handleSuggestContest = async () => {
    const suggestion = await suggestContest(theme);
    if (suggestion) {
      setAiResponse(suggestion);
    }
  };

  const handleGenerateContent = async () => {
    const content = await generateContent(theme);
    if (content) {
      setAiResponse(content);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          AI Contest Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter theme or contest title..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSuggestContest}
              disabled={isLoading || !theme}
              className="flex-1"
            >
              {isLoading ? 'Generating...' : 'Suggest Contest'}
            </Button>
            <Button
              onClick={handleGenerateContent}
              disabled={isLoading || !theme}
              variant="outline"
              className="flex-1"
            >
              Generate Content
            </Button>
          </div>
        </div>
        {aiResponse && (
          <Textarea
            value={aiResponse}
            readOnly
            className="h-[200px] bg-muted"
          />
        )}
      </CardContent>
    </Card>
  );
};