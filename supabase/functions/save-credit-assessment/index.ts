import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { 
      monthlyIncome, 
      monthlyExpenses, 
      savings, 
      existingLoans,
      creditScore,
      riskLevel,
      recommendations 
    } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Saving credit assessment for user:', user.id);

    // Save credit assessment to database
    const { data, error } = await supabase
      .from('credit_assessments')
      .insert({
        user_id: user.id,
        monthly_income: monthlyIncome,
        monthly_expenses: monthlyExpenses,
        savings,
        existing_loans: existingLoans || 0,
        credit_score: creditScore,
        risk_level: riskLevel,
        recommendations
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, assessment: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in save-credit-assessment function:', error);
    
    // Return safe generic error message to prevent information leakage
    const safeMessage = error.message?.toLowerCase().includes('auth') 
      ? 'Authentication failed. Please log in again.' 
      : 'Unable to save credit assessment. Please try again.';
    
    return new Response(JSON.stringify({ error: safeMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});