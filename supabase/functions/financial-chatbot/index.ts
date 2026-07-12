import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Starting financial-chatbot function...');

    // Get user from auth header
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { message, language = 'both' } = await req.json();
    console.log('Received message:', message, 'Language:', language);

    if (!message) {
      console.error('No message provided');
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const languageInstructions = {
      hindi: "केवल हिंदी में जवाब दें।",
      english: "Respond only in English.",
      both: "Include both Hindi and English when helpful."
    };

    const systemPrompt = `You are "Udyami", a helpful financial literacy assistant designed specifically for rural Indian women. You help with:

1. Basic financial concepts (savings, loans, interest rates)
2. Digital payment systems (UPI, banking apps)
3. Government schemes and benefits
4. Budgeting and expense management
5. Fraud prevention and safety

Guidelines:
- Respond in simple, easy-to-understand language
- Use practical examples relevant to rural Indian contexts
- ${languageInstructions[language as keyof typeof languageInstructions]}
- Focus on actionable advice
- Be encouraging and supportive
- Avoid complex financial jargon
- When discussing money, use Indian Rupees (₹)

Keep responses concise but helpful. If asked about complex topics, break them down into simple steps.`;

    console.log('Calling Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser message: ${message}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorText);
      
      let userFriendlyError = "I'm temporarily unavailable. Please try again in a moment.";
      
      if (response.status === 401) {
        userFriendlyError = "Authentication issue with AI service. Please contact support.";
      } else if (response.status === 429) {
        userFriendlyError = "Too many requests. Please wait a moment and try again.";
      } else if (response.status === 400) {
        userFriendlyError = "Invalid request. Please try rephrasing your question.";
      }
      
      return new Response(
        JSON.stringify({ error: userFriendlyError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Gemini response received successfully');
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    console.log('Got response from Anthropic, saving to database...');

    // Save conversation to database
    try {
      const { error: dbError } = await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: user.id,
          message,
          response: aiResponse
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if database save fails
      }
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      // Don't fail the request if database save fails
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in financial-chatbot function:', error);
    
    // Return safe generic error message to prevent information leakage
    const safeMessage = error.message?.toLowerCase().includes('auth') 
      ? 'Authentication failed. Please log in again.' 
      : 'An error occurred while processing your request. Please try again.';
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});