import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current year (last 2 digits)
    const currentYear = new Date().getFullYear().toString().slice(-2)
    
    // Get or create counter for current year
    const { data: counterData, error: counterError } = await supabase
      .from('order_id_counters')
      .select('current_number')
      .eq('year', currentYear)
      .single()

    let nextNumber: number

    if (counterError || !counterData) {
      // Create new counter for this year
      const { data: newCounter, error: insertError } = await supabase
        .from('order_id_counters')
        .insert({
          year: currentYear,
          current_number: 1
        })
        .select('current_number')
        .single()

      if (insertError) {
        throw new Error(`Failed to create counter: ${insertError.message}`)
      }

      nextNumber = 1
    } else {
      // Increment existing counter
      nextNumber = counterData.current_number + 1
      
      const { error: updateError } = await supabase
        .from('order_id_counters')
        .update({ current_number: nextNumber })
        .eq('year', currentYear)

      if (updateError) {
        throw new Error(`Failed to update counter: ${updateError.message}`)
      }
    }

    // Format the order ID: HP-YY-XXXXXXX
    const formattedNumber = nextNumber.toString().padStart(7, '0')
    const orderId = `HP-${currentYear}-${formattedNumber}`

    return new Response(
      JSON.stringify({
        order_id: orderId,
        year: currentYear,
        sequence_number: nextNumber
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating order ID:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}) 