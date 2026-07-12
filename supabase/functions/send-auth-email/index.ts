import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  token?: string;
  token_hash?: string;
  redirect_to?: string;
  email_action_type?: string;
  site_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Auth email function called with method:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthEmailRequest = await req.json();
    console.log("Email payload:", { ...payload, token: payload.token ? "[REDACTED]" : undefined });

    const { email, token_hash, redirect_to, email_action_type } = payload;

    if (!email) {
      throw new Error("Email is required");
    }

    // Generate confirmation link with proper app redirect
    const appUrl = redirect_to || 'http://localhost:3000';
    const confirmationUrl = token_hash && email_action_type 
      ? `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(appUrl)}`
      : "#";
    
    console.log("Generated confirmation URL:", confirmationUrl);

    // Send different emails based on action type
    let subject = "वित्त सखी - Email Verification";
    let htmlContent = "";

    if (email_action_type === "signup") {
      subject = "वित्त सखी - Verify Your Email | ईमेल सत्यापित करें";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">वित्त सखी</h1>
          <h2 style="color: #1f2937;">Welcome to वित्त सखी! | स्वागत है!</h2>
          
          <p>Thank you for signing up for वित्त सखी, your trusted financial companion.</p>
          <p>वित्त सखी में आपका स्वागत है, आपकी विश्वसनीय वित्तीय साथी।</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: linear-gradient(135deg, #2563eb, #3b82f6); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              Verify Email | ईमेल सत्यापित करें
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create this account, you can safely ignore this email.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            यदि आपने यह खाता नहीं बनाया है, तो आप इस ईमेल को सुरक्षित रूप से नज़रअंदाज़ कर सकते हैं।
          </p>
        </div>
      `;
    } else {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">वित्त सखी</h1>
          <p>Please click the link below to continue:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: linear-gradient(135deg, #2563eb, #3b82f6); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;">
              Continue
            </a>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "वित्त सखी <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);