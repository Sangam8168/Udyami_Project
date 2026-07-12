import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sampleSchemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    ministry_department: "Ministry of Agriculture & Farmers Welfare",
    category: "agriculture",
    state: null,
    description: "Financial support to land holding farmers families for procurement of inputs such as seeds, fertilizers, equipment etc. and to meet other needs in crop production and household needs.",
    eligibility_criteria: {
      income_level: "low",
      occupation: "Farmer",
      land_ownership: "Yes",
      location_type: "rural"
    },
    benefits: "₹6,000 per year in three equal installments of ₹2,000 each",
    benefit_amount: "₹6,000 per year",
    application_process: "1. Visit PM-KISAN portal (pmkisan.gov.in)\n2. Click on 'Farmers Corner' > 'New Farmer Registration'\n3. Fill required details and submit documents\n4. Application will be verified by local officials\n5. Benefits will be transferred directly to bank account",
    official_link: "https://pmkisan.gov.in/",
    documents_required: ["Land ownership papers", "Aadhaar card", "Bank account details", "Mobile number"],
    application_deadline: null
  },
  {
    name: "Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat)",
    ministry_department: "Ministry of Health and Family Welfare",
    category: "health",
    state: null,
    description: "Free health insurance coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    eligibility_criteria: {
      income_level: "low",
      socio_economic_status: "Below Poverty Line",
      location_type: "any"
    },
    benefits: "Free health insurance coverage up to ₹5 lakhs per family per year",
    benefit_amount: "Up to ₹5,00,000 per family per year",
    application_process: "1. Check eligibility at pmjay.gov.in\n2. Visit nearest Common Service Centre (CSC)\n3. Provide required documents for verification\n4. Get Ayushman Bharat card issued\n5. Use card at empaneled hospitals for cashless treatment",
    official_link: "https://pmjay.gov.in/",
    documents_required: ["Aadhaar card", "Ration card", "Income certificate", "Family ID"],
    application_deadline: null
  },
  {
    name: "Beti Bachao Beti Padhao",
    ministry_department: "Ministry of Women and Child Development",
    category: "women",
    state: null,
    description: "Scheme to address declining Child Sex Ratio and related issues of empowerment of women over a life-cycle continuum.",
    eligibility_criteria: {
      gender: "female",
      age_min: 0,
      age_max: 18,
      location_type: "any"
    },
    benefits: "Educational support, awareness programs, and financial incentives for girl child education",
    benefit_amount: "Variable based on education level",
    application_process: "1. Contact local Anganwadi worker or school\n2. Submit application with required documents\n3. Participate in awareness programs\n4. Benefits will be provided through schools and health centers",
    official_link: "https://wcd.nic.in/bbbp-scheme",
    documents_required: ["Birth certificate", "Aadhaar card", "School enrollment certificate", "Bank account details"],
    application_deadline: null
  },
  {
    name: "Mudra Yojana",
    ministry_department: "Ministry of Finance",
    category: "finance",
    state: null,
    description: "Provides loans up to ₹10 lakh to micro and small enterprises and to individuals who wish to start their business.",
    eligibility_criteria: {
      occupation: "Self-employed",
      business_type: "Micro/Small enterprise",
      location_type: "any"
    },
    benefits: "Collateral-free business loans up to ₹10 lakhs",
    benefit_amount: "Up to ₹10,00,000",
    application_process: "1. Approach any bank or financial institution\n2. Fill MUDRA loan application form\n3. Submit business plan and required documents\n4. Bank will assess and approve the loan\n5. Loan amount will be disbursed to your account",
    official_link: "https://www.mudra.org.in/",
    documents_required: ["Business plan", "Identity proof", "Address proof", "Bank statements", "Income proof"],
    application_deadline: null
  },
  {
    name: "National Scholarship Portal",
    ministry_department: "Ministry of Electronics and Information Technology",
    category: "education",
    state: null,
    description: "Scholarships for students from various backgrounds including SC/ST, OBC, minorities, and economically weaker sections.",
    eligibility_criteria: {
      student_status: "Enrolled in recognized institution",
      income_level: "low",
      age_min: 16,
      age_max: 25
    },
    benefits: "Financial assistance for education expenses including tuition fees, books, and living expenses",
    benefit_amount: "₹10,000 to ₹2,00,000 per year",
    application_process: "1. Register on National Scholarship Portal (scholarships.gov.in)\n2. Fill online application form\n3. Upload required documents\n4. Submit application before deadline\n5. Track application status online",
    official_link: "https://scholarships.gov.in/",
    documents_required: ["Academic certificates", "Income certificate", "Caste certificate (if applicable)", "Bank account details", "Aadhaar card"],
    application_deadline: "2024-12-31"
  },
  {
    name: "Stand Up India",
    ministry_department: "Ministry of Finance",
    category: "employment",
    state: null,
    description: "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
    eligibility_criteria: {
      gender: "female",
      business_type: "Manufacturing/Service/Trading",
      location_type: "any",
      loan_amount_min: 1000000,
      loan_amount_max: 10000000
    },
    benefits: "Bank loans between ₹10 lakh to ₹1 crore for starting greenfield enterprises",
    benefit_amount: "₹10,00,000 to ₹1,00,00,000",
    application_process: "1. Visit standupmitra.in portal\n2. Register and create business plan\n3. Submit application with required documents\n4. Get mentorship support\n5. Bank will process loan application",
    official_link: "https://www.standupmitra.in/",
    documents_required: ["Project report", "Identity proof", "Address proof", "Educational certificates", "Experience certificates"],
    application_deadline: null
  },
  {
    name: "Kisan Credit Card",
    ministry_department: "Ministry of Agriculture & Farmers Welfare",
    category: "agriculture",
    state: null,
    description: "Provides adequate and timely credit support from the banking system to farmers for their cultivation needs in a flexible and cost-effective manner.",
    eligibility_criteria: {
      occupation: "Farmer",
      land_ownership: "Owner/Tenant/Sharecropper",
      location_type: "rural"
    },
    benefits: "Credit facility for crop production, post-harvest expenses, and agricultural activities",
    benefit_amount: "Based on cropping pattern and scale of finance",
    application_process: "1. Visit nearest bank branch\n2. Fill KCC application form\n3. Submit required documents\n4. Bank will verify and assess credit limit\n5. KCC will be issued with credit limit",
    official_link: "https://pmkisan.gov.in/KCC.aspx",
    documents_required: ["Land documents", "Identity proof", "Address proof", "Income proof", "Passport size photos"],
    application_deadline: null
  },
  {
    name: "Sukanya Samriddhi Yojana",
    ministry_department: "Ministry of Finance",
    category: "finance",
    state: null,
    description: "Small deposit scheme for the girl child aimed at promoting the welfare of the girl child and building a fund for her education and marriage expenses.",
    eligibility_criteria: {
      gender: "female",
      age_min: 0,
      age_max: 10,
      parents_required: "Yes"
    },
    benefits: "High interest rate savings scheme with tax benefits",
    benefit_amount: "Minimum ₹250, Maximum ₹1,50,000 per year",
    application_process: "1. Visit any bank or post office\n2. Fill SSY account opening form\n3. Submit required documents\n4. Make initial deposit\n5. Continue deposits for 15 years",
    official_link: "https://www.india.gov.in/sukanya-samriddhi-yojana",
    documents_required: ["Birth certificate of girl child", "Identity proof of parent", "Address proof", "Passport size photos"],
    application_deadline: null
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert sample schemes
    const { data, error } = await supabase
      .from("schemes")
      .upsert(sampleSchemes, { onConflict: "name" });

    if (error) {
      console.error("Error inserting schemes:", error);
      throw error;
    }

    console.log("Successfully populated schemes data");

    return new Response(
      JSON.stringify({ 
        message: "Schemes data populated successfully", 
        count: sampleSchemes.length 
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
});