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

    const grokApiKey = Deno.env.get('GROK_API_KEY')
    if (!grokApiKey) {
      throw new Error('GROK_API_KEY not configured')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const questions = []
    for (const url of urls) {
      const prompt = `Create 4 multiple choice questions based on the content from this URL: ${url}. 
      Format each question as a JSON object with these fields:
      - question_text: the question
      - options: array of 4 possible answers
      - correct_answer: the correct answer (must be one of the options)
      - article_url: the source URL
      Return an array of these question objects.`

      const response = await fetch('https://api.groq.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grokApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates multiple choice questions.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.statusText}`)
      }

      const data = await response.json()
      const generatedQuestions = JSON.parse(data.choices[0].message.content)
      questions.push(...generatedQuestions)
    }

    // Save questions to the question bank
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