import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { urls } = await req.json();
    console.log('Received URLs:', urls);

    const ollamaUrl = Deno.env.get('OLLAMA_URL');
    if (!ollamaUrl) {
      throw new Error('OLLAMA_URL not configured');
    }

    console.log('Using Ollama URL:', ollamaUrl);
    
    try {
      console.log('Attempting to connect to Ollama at:', ollamaUrl);
      const testResponse = await fetch(`${ollamaUrl}/api/tags`);
      
      if (!testResponse.ok) {
        console.error('Failed to connect to Ollama:', testResponse.status, testResponse.statusText);
        const errorText = await testResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Cannot connect to Ollama: ${testResponse.statusText}`);
      }
      
      const models = await testResponse.json();
      console.log('Available Ollama models:', models);
    } catch (error) {
      console.error('Error connecting to Ollama:', error);
      throw new Error(`Failed to connect to Ollama: ${error.message}`);
    }

    const questions = [];

    for (const url of urls) {
      console.log(`Processing URL: ${url}`);
      const prompt = `Crée 4 questions à choix multiples en français basées sur le contenu de cette URL: ${url}. 
      Formate ta réponse comme un tableau JSON d'objets. Chaque objet doit avoir exactement ces champs:
      {
        "question_text": "le texte de la question en français",
        "options": ["option1 en français", "option2 en français", "option3 en français", "option4 en français"],
        "correct_answer": "la bonne réponse (doit être une des options)",
        "article_url": "${url}"
      }
      Retourne UNIQUEMENT le tableau JSON, sans autre texte.`;

      console.log('Sending request to Ollama...');
      try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen2.5:7b',
            prompt: prompt,
            stream: false,
          }),
        });

        if (!response.ok) {
          console.error('Ollama response not OK:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to generate questions: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received response from Ollama:', data);
        
        try {
          const cleanedResponse = data.response.replace(/```json\n?|\n?```/g, '').trim();
          console.log('Cleaned response:', cleanedResponse);
          
          const generatedQuestions = JSON.parse(cleanedResponse);
          console.log('Parsed questions:', generatedQuestions);
          
          if (!Array.isArray(generatedQuestions)) {
            throw new Error('Response is not an array');
          }
          
          generatedQuestions.forEach((q, index) => {
            if (!q.question_text || !Array.isArray(q.options) || !q.correct_answer || !q.article_url) {
              throw new Error(`Invalid question object at index ${index}`);
            }
            if (!q.options.includes(q.correct_answer)) {
              throw new Error(`Correct answer not found in options at index ${index}`);
            }
          });
          
          questions.push(...generatedQuestions);
        } catch (error) {
          console.error('Error parsing questions:', error);
          console.log('Raw response:', data.response);
          throw new Error(`Failed to parse generated questions: ${error.message}`);
        }
      } catch (error) {
        console.error('Error making request to Ollama:', error);
        throw new Error(`Failed to make request to Ollama: ${error.message}`);
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Saving questions to database:', questions);

    const { error } = await supabase
      .from('question_bank')
      .insert(questions.map(q => ({
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        status: 'available'
      })));

    if (error) {
      console.error('Error saving to database:', error);
      throw error;
    }

    console.log('Successfully saved questions to database');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${questions.length} questions ont été générées et sauvegardées`,
        questions 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});