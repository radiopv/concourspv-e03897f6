import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    if (!GROK_API_KEY) {
      throw new Error('GROK_API_KEY is not configured');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates multiple choice questions. Each question should have 4 options and one correct answer. Return the response in JSON format with the following structure: { questions: [{ question_text: string, options: string[], correct_answer: string }] }"
          },
          {
            role: "user",
            content: `Generate ${count} multiple choice questions about ${topic}. Make sure each question has exactly 4 options and one correct answer. Format the response as JSON.`
          }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      console.error('Grok API error:', await response.text());
      throw new Error(`Grok API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('Grok API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Grok API');
    }

    // Parse the response and validate it's in the correct format
    let generatedQuestions;
    try {
      const content = data.choices[0].message.content;
      generatedQuestions = JSON.parse(content);
      
      if (!generatedQuestions.questions || !Array.isArray(generatedQuestions.questions)) {
        throw new Error('Invalid questions format');
      }
    } catch (error) {
      console.error('Error parsing questions:', error);
      throw new Error('Failed to parse generated questions');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: generatedQuestions.questions 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});