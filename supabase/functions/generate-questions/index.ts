import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROK_API_KEY = Deno.env.get('GROK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, count = 1 } = await req.json();

    console.log('Generating questions for topic:', topic);

    const response = await fetch('https://api.grok.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "grok-2",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates multiple choice questions. Each question should have 4 options and one correct answer. Return the response in JSON format with the following structure: { questions: [{ question_text: string, options: string[], correct_answer: string }] }"
          },
          {
            role: "user",
            content: `Generate ${count} multiple choice questions about ${topic}. Make sure each question has exactly 4 options and one correct answer.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('Grok API response:', data);

    // Parse the response to extract questions
    const generatedQuestions = JSON.parse(data.choices[0].message.content).questions;

    return new Response(JSON.stringify({ questions: generatedQuestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});