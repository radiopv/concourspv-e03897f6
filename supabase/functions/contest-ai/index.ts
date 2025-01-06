import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    let prompt = '';
    let systemPrompt = '';

    switch (action) {
      case 'suggest-contest':
        systemPrompt = 'You are a contest creation expert. Suggest engaging and relevant contests based on the provided theme or category.';
        prompt = `Suggest a contest idea for the theme: ${data.theme}. Include a title, description, and potential questions.`;
        break;

      case 'generate-content':
        systemPrompt = 'You are a content creation expert. Generate engaging content for contests.';
        prompt = `Create content for a contest titled "${data.title}". Include 5 multiple-choice questions with answers.`;
        break;

      case 'participant-feedback':
        systemPrompt = 'You are a helpful contest mentor. Provide constructive feedback to participants based on their performance.';
        prompt = `Generate personalized feedback for a participant who scored ${data.score}% in the contest "${data.contestTitle}". Include encouragement and tips for improvement.`;
        break;

      case 'predict-difficulty':
        systemPrompt = 'You are a contest difficulty analysis expert. Predict the difficulty level of contests based on their content.';
        prompt = `Analyze the following contest questions and predict the difficulty level:\n${JSON.stringify(data.questions)}`;
        break;

      default:
        throw new Error('Invalid action specified');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`Making OpenAI API request for action: ${action}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API returned status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('Unexpected OpenAI API response format:', result);
      throw new Error('Invalid response format from OpenAI API');
    }

    return new Response(JSON.stringify({
      content: result.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in contest-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});