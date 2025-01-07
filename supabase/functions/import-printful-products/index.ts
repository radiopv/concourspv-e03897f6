import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PRINTFUL_API_KEY = Deno.env.get('PRINTFUL_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Printful products import...')
    
    // Fetch products from Printful
    const printfulResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      },
    })

    if (!printfulResponse.ok) {
      throw new Error(`Printful API error: ${printfulResponse.statusText}`)
    }

    const printfulData = await printfulResponse.json()
    const products = printfulData.result

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

    // Process each product
    const processedProducts = products.map((product: any) => ({
      printful_id: product.id.toString(),
      name: product.name,
      description: product.description || null,
      image_url: product.thumbnail_url || null,
      price: product.retail_price || 0,
    }))

    // Upsert products to database
    const { data, error } = await supabase
      .from('products')
      .upsert(processedProducts, {
        onConflict: 'printful_id',
        ignoreDuplicates: false,
      })

    if (error) throw error

    console.log('Import completed successfully')
    return new Response(
      JSON.stringify({ success: true, message: 'Products imported successfully', count: processedProducts.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error importing products:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})