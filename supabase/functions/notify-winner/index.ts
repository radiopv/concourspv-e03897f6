import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { winnerId, contestId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Récupération des informations du gagnant et du concours
    const { data: winner } = await supabaseClient
      .from('participants')
      .select('*, contests(*)')
      .eq('id', winnerId)
      .single()

    if (!winner) {
      throw new Error('Gagnant non trouvé')
    }

    // Envoi de l'email (exemple avec un service d'email)
    const emailResponse = await fetch('https://api.votre-service-email.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('EMAIL_SERVICE_API_KEY')}`
      },
      body: JSON.stringify({
        to: winner.email,
        subject: `Félicitations ! Vous avez gagné le concours ${winner.contests.title}`,
        text: `Félicitations ! Vous avez gagné le concours "${winner.contests.title}". 
               Connectez-vous à votre compte pour réclamer votre prix.`
      })
    })

    if (!emailResponse.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})