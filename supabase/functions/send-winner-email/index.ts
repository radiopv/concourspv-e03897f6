import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface EmailData {
  winnerEmail: string;
  winnerName: string;
  contestTitle: string;
  prizeName: string;
  shippingAddress: string;
}

serve(async (req) => {
  try {
    const { winnerEmail, winnerName, contestTitle, prizeName, shippingAddress } = await req.json() as EmailData;

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Vous pouvez utiliser n'importe quel service d'email ici (SendGrid, Resend, etc.)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'concours@votresite.com',
        to: winnerEmail,
        subject: `Confirmation de votre prix - ${contestTitle}`,
        html: `
          <h1>Félicitations ${winnerName} !</h1>
          <p>Nous avons bien reçu votre demande de réclamation pour le prix "${prizeName}" du concours "${contestTitle}".</p>
          <p>Votre prix sera envoyé à l'adresse suivante :</p>
          <p>${shippingAddress}</p>
          <p>Nous vous contacterons prochainement pour organiser la livraison.</p>
          <p>Merci de votre participation !</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});