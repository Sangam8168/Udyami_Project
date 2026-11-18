import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample government schemes data - In production, this would fetch from official APIs
const GOVERNMENT_SCHEMES = [
  {
    name: "Pradhan Mantri Jan Dhan Yojana",
    name_hi: "प्रधानमंत्री जन धन योजना",
    description: "Financial inclusion program to ensure access to financial services",
    description_hi: "वित्तीय समावेशन कार्यक्रम वित्तीय सेवाओं तक पहुंच सुनिश्चित करने के लिए",
    ministry_department: "Ministry of Finance",
    category: "finance",
    state: null,
    benefits: "Zero balance bank account, RuPay debit card, accident insurance cover, overdraft facility",
    benefits_hi: "शून्य बैलेंस बैंक खाता, रुपे डेबिट कार्ड, दुर्घटना बीमा कवर, ओवरड्राफ्ट सुविधा",
    benefit_amount: "Up to ₹10,000 overdraft",
    eligibility_criteria: {
      age_min: 18,
      gender: "any",
      income_level: "any",
      occupation: "any"
    },
    application_process: "Visit any bank branch with Aadhaar card and passport photo",
    application_process_hi: "आधार कार्ड और पासपोर्ट फोटो के साथ किसी भी बैंक शाखा में जाएं",
    official_link: "https://pmjdy.gov.in",
    documents_required: ["Aadhaar Card", "Passport Photo", "Mobile Number"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    name_hi: "प्रधानमंत्री आवास योजना",
    description: "Housing for All by 2022 - providing affordable housing to urban poor",
    description_hi: "2022 तक सभी के लिए आवास - शहरी गरीबों को किफायती आवास प्रदान करना",
    ministry_department: "Ministry of Housing and Urban Affairs",
    category: "housing",
    state: null,
    benefits: "Subsidized housing loans, interest subsidy up to 6.5%",
    benefits_hi: "सब्सिडी वाले आवास ऋण, 6.5% तक ब्याज सब्सिडी",
    benefit_amount: "Up to ₹2.67 lakh subsidy",
    eligibility_criteria: {
      age_min: 18,
      gender: "any",
      income_level: "low",
      occupation: "any"
    },
    application_process: "Apply through PMAY portal or Common Service Centers",
    application_process_hi: "PMAY पोर्टल या सामान्य सेवा केंद्रों के माध्यम से आवेदन करें",
    official_link: "https://pmay.gov.in",
    documents_required: ["Aadhaar Card", "Income Certificate", "Bank Account", "Property Documents"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Ujjwala Yojana",
    name_hi: "प्रधानमंत्री उज्ज्वला योजना",
    description: "Providing LPG connections to BPL households",
    description_hi: "बीपीएल परिवारों को एलपीजी कनेक्शन प्रदान करना",
    ministry_department: "Ministry of Petroleum and Natural Gas",
    category: "energy",
    state: null,
    benefits: "Free LPG connection, stove, and first refill",
    benefits_hi: "मुफ्त एलपीजी कनेक्शन, स्टोव और पहला रिफिल",
    benefit_amount: "₹1,600 subsidy",
    eligibility_criteria: {
      age_min: 18,
      gender: "female",
      income_level: "low",
      occupation: "any"
    },
    application_process: "Apply through LPG distributor or online portal",
    application_process_hi: "एलपीजी वितरक या ऑनलाइन पोर्टल के माध्यम से आवेदन करें",
    official_link: "https://pmujjwalayojana.com",
    documents_required: ["Aadhaar Card", "BPL Card", "Bank Account", "Photo"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Matru Vandana Yojana",
    name_hi: "प्रधानमंत्री मातृ वंदना योजना",
    description: "Maternity benefit program for pregnant women and lactating mothers",
    description_hi: "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं के लिए मातृत्व लाभ कार्यक्रम",
    ministry_department: "Ministry of Women and Child Development",
    category: "women",
    state: null,
    benefits: "Cash incentive for improved health and nutrition",
    benefits_hi: "बेहतर स्वास्थ्य और पोषण के लिए नकद प्रोत्साहन",
    benefit_amount: "₹5,000 in 3 installments",
    eligibility_criteria: {
      age_min: 19,
      gender: "female",
      income_level: "low",
      occupation: "any"
    },
    application_process: "Apply through Anganwadi centers or health facilities",
    application_process_hi: "आंगनवाड़ी केंद्रों या स्वास्थ्य सुविधाओं के माध्यम से आवेदन करें",
    official_link: "https://wcd.nic.in",
    documents_required: ["Aadhaar Card", "Bank Account", "Pregnancy Certificate", "MC Registration"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana",
    name_hi: "प्रधानमंत्री कौशल विकास योजना",
    description: "Skill development program to provide industry-relevant skills",
    description_hi: "उद्योग-प्रासंगिक कौशल प्रदान करने के लिए कौशल विकास कार्यक्रम",
    ministry_department: "Ministry of Skill Development and Entrepreneurship",
    category: "employment",
    state: null,
    benefits: "Free skill training, certification, placement assistance",
    benefits_hi: "मुफ्त कौशल प्रशिक्षण, प्रमाणन, नियोजन सहायता",
    benefit_amount: "Training + Certification",
    eligibility_criteria: {
      age_min: 15,
      age_max: 35,
      gender: "any",
      income_level: "any",
      occupation: "unemployed"
    },
    application_process: "Register at PMKVY centers or online portal",
    application_process_hi: "PMKVY केंद्रों या ऑनलाइन पोर्टल पर पंजीकरण करें",
    official_link: "https://pmkvyofficial.org",
    documents_required: ["Aadhaar Card", "Educational Certificates", "Bank Account", "Photo"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    name_hi: "प्रधानमंत्री फसल बीमा योजना",
    description: "Crop insurance scheme to provide financial support to farmers",
    description_hi: "किसानों को वित्तीय सहायता प्रदान करने के लिए फसल बीमा योजना",
    ministry_department: "Ministry of Agriculture",
    category: "agriculture",
    state: null,
    benefits: "Crop insurance against natural calamities, pests, and diseases",
    benefits_hi: "प्राकृतिक आपदाओं, कीटों और रोगों के खिलाफ फसल बीमा",
    benefit_amount: "Premium subsidy up to 50%",
    eligibility_criteria: {
      age_min: 18,
      gender: "any",
      income_level: "low",
      occupation: "farmer"
    },
    application_process: "Apply through banks, insurance companies, or Common Service Centers",
    application_process_hi: "बैंकों, बीमा कंपनियों या सामान्य सेवा केंद्रों के माध्यम से आवेदन करें",
    official_link: "https://pmfby.gov.in",
    documents_required: ["Aadhaar Card", "Land Documents", "Bank Account", "Crop Details"],
    application_deadline: null
  },
  {
    name: "Beti Bachao Beti Padhao",
    name_hi: "बेटी बचाओ बेटी पढ़ाओ",
    description: "Campaign to save and educate the girl child",
    description_hi: "बेटी को बचाने और शिक्षित करने के लिए अभियान",
    ministry_department: "Ministry of Women and Child Development",
    category: "women",
    state: null,
    benefits: "Financial assistance for girl child education, protection schemes",
    benefits_hi: "बेटी की शिक्षा के लिए वित्तीय सहायता, सुरक्षा योजनाएं",
    benefit_amount: "Variable benefits",
    eligibility_criteria: {
      gender: "female",
      income_level: "low",
      occupation: "any"
    },
    application_process: "Contact local women and child development office",
    application_process_hi: "स्थानीय महिला और बाल विकास कार्यालय से संपर्क करें",
    official_link: "https://wcd.nic.in/bbbp",
    documents_required: ["Aadhaar Card", "Birth Certificate", "Bank Account"],
    application_deadline: null
  },
  {
    name: "National Health Protection Scheme (Ayushman Bharat)",
    name_hi: "राष्ट्रीय स्वास्थ्य सुरक्षा योजना (आयुष्मान भारत)",
    description: "Health insurance scheme for poor families",
    description_hi: "गरीब परिवारों के लिए स्वास्थ्य बीमा योजना",
    ministry_department: "Ministry of Health and Family Welfare",
    category: "health",
    state: null,
    benefits: "Health coverage up to ₹5 lakh per family per year",
    benefits_hi: "प्रति परिवार प्रति वर्ष ₹5 लाख तक स्वास्थ्य कवरेज",
    benefit_amount: "₹5,000,000 coverage",
    eligibility_criteria: {
      income_level: "low",
      occupation: "any"
    },
    application_process: "Check eligibility and apply at empanelled hospitals",
    application_process_hi: "पात्रता जांचें और अस्पतालों में आवेदन करें",
    official_link: "https://pmjay.gov.in",
    documents_required: ["Aadhaar Card", "Ration Card", "Bank Account", "Mobile Number"],
    application_deadline: null
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action } = await req.json();

    if (action === 'fetch') {
      console.log('Fetching government schemes...');
      
      let addedCount = 0;
      let updatedCount = 0;

      for (const scheme of GOVERNMENT_SCHEMES) {
        // Check if scheme already exists
        const { data: existingScheme } = await supabase
          .from('schemes')
          .select('id, updated_at')
          .eq('name', scheme.name)
          .maybeSingle();

        if (existingScheme) {
          // Update existing scheme
          await supabase
            .from('schemes')
            .update({
              ...scheme,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingScheme.id);
          updatedCount++;
        } else {
          // Insert new scheme
          await supabase
            .from('schemes')
            .insert({
              ...scheme,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          addedCount++;
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Updated ${updatedCount} schemes, added ${addedCount} new schemes`,
          total: GOVERNMENT_SCHEMES.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-government-schemes function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
