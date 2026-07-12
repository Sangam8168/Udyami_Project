import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FraudDetectionResult {
  isSuspicious: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'english' } = await req.json();

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing message for fraud detection:', message);

    const systemPrompt = `You are an advanced fraud detection AI specialized in financial scams and social engineering attacks. Analyze the given message and determine if it contains fraudulent, suspicious, or harmful content.

Focus on detecting:
1. Phishing attempts (asking for OTP, PIN, passwords, bank details)
2. Advance fee fraud (lottery scams, government grants, urgent payments)
3. Investment scams (guaranteed returns, get-rich-quick schemes)
4. Social engineering (urgency tactics, fake authority claims)
5. Suspicious links or contact information
6. Identity theft attempts

For both English and Hindi content, provide your analysis in this exact JSON format:
{
  "isSuspicious": boolean,
  "confidence": number (0-100),
  "severity": "low" | "medium" | "high",
  "reason": "detailed explanation",
  "category": "phishing" | "investment_scam" | "advance_fee_fraud" | "social_engineering" | "suspicious_contact" | "legitimate" | "educational_query"
}

Severity guidelines:
- HIGH: Direct requests for sensitive info (OTP, PIN, passwords), urgent money transfers, lottery/prize claims
- MEDIUM: Investment opportunities with guarantees, suspicious contact requests, potential phishing
- LOW: General fraud-related educational questions, minor suspicious patterns

Be strict but fair - legitimate questions about fraud prevention should not be flagged as suspicious.`;

    // Retry logic with exponential backoff for rate limiting
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nAnalyze this message for fraud indicators (language: ${language}):\n\n"${message}"` }]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 300,
            }
          }),
        });

        if (response.ok) {
          break;
        } else if (response.status === 429 && retryCount < maxRetries) {
          // Wait with exponential backoff
          const waitTime = Math.pow(2, retryCount) * 1000;
          console.log(`Rate limited, retrying in ${waitTime}ms (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      } catch (fetchError) {
        if (retryCount < maxRetries) {
          retryCount++;
          const waitTime = Math.pow(2, retryCount) * 1000;
          console.log(`Request failed, retrying in ${waitTime}ms (attempt ${retryCount})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          throw fetchError;
        }
      }
    }

    if (!response.ok) {
      console.error('Google Gemini API error:', response.status, response.statusText);
      throw new Error(`Google Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('ML Analysis result:', analysisText);

    // Parse the JSON response from Gemini - handle markdown code blocks
    let fraudAnalysis: FraudDetectionResult;
    try {
      // Remove markdown code blocks if present
      analysisText = analysisText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      fraudAnalysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse ML analysis:', parseError);
      // Fallback response if JSON parsing fails
      fraudAnalysis = {
        isSuspicious: false,
        confidence: 0,
        severity: 'low',
        reason: 'Analysis inconclusive',
        category: 'legitimate'
      };
    }

    // Validate and sanitize the response
    const result: FraudDetectionResult = {
      isSuspicious: Boolean(fraudAnalysis.isSuspicious),
      confidence: Math.min(100, Math.max(0, Number(fraudAnalysis.confidence) || 0)),
      severity: ['low', 'medium', 'high'].includes(fraudAnalysis.severity) ? fraudAnalysis.severity : 'low',
      reason: String(fraudAnalysis.reason || 'No specific reason provided'),
      category: String(fraudAnalysis.category || 'unknown')
    };

    console.log('Final fraud detection result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ML fraud detection:', error);
    
    // Return a safe fallback result instead of exposing the error
    const fallbackResult: FraudDetectionResult = {
      isSuspicious: false,
      confidence: 0,
      severity: 'low',
      reason: 'Analysis service temporarily unavailable',
      category: 'legitimate'
    };

    return new Response(
      JSON.stringify(fallbackResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});