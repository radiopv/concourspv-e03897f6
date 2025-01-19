import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { urls } = await req.json()
    console.log('Received URLs:', urls)

    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error('No URLs provided')
    }

    const ollamaUrl = Deno.env.get('OLLAMA_URL')
    if (!ollamaUrl) {
      throw new Error('OLLAMA_URL not configured')
    }

    console.log('Using Ollama URL:', ollamaUrl)
    const questions = []

    for (const url of urls) {
      const prompt = `Create 4 multiple choice questions based on the content from this URL: ${url}. 
      Format each question as a JSON object with these fields:
      - question_text: the question
      - options: array of 4 possible answers
      - correct_answer: the correct answer (must be one of the options)
      - article_url: the source URL
      Return an array of these question objects.`

      console.log('Sending request to Ollama...')
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
      })

      if (!response.ok) {
        console.error('Ollama response not OK:', response.status, response.statusText)
        throw new Error(`Failed to generate questions: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Ollama response:', data)
      
      try {
        const generatedQuestions = JSON.parse(data.response)
        questions.push(...generatedQuestions)
      } catch (error) {
        console.error('Error parsing questions:', error)
        console.log('Raw response:', data.response)
        throw new Error('Failed to parse generated questions')
      }
    }

    // Save questions to the question bank
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase
      .from('question_bank')
      .insert(questions.map(q => ({
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        status: 'available'
      })))

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated and saved ${questions.length} questions`,
        questions 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})