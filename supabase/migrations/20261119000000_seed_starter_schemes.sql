-- Populate the central scheme catalog without replacing existing records.
WITH starter_schemes (name, ministry_department, category, description, eligibility_criteria, benefits, benefit_amount, application_process, official_link) AS (
  VALUES
  (
    'PM-KISAN',
    'Ministry of Agriculture and Farmers Welfare',
    'agriculture',
    'Income support for eligible landholding farmer families.',
    '{"occupation": "Farmer", "requirements": "Cultivable land and scheme eligibility rules apply."}'::jsonb,
    'Income support is paid in three installments by direct bank transfer.',
    '₹6,000 per year',
    'Use New Farmer Registration on the PM-KISAN portal and follow the eKYC instructions.',
    'https://www.pmkisan.gov.in/'
  ),
  (
    'Pradhan Mantri Jan Dhan Yojana',
    'Department of Financial Services, Ministry of Finance',
    'finance',
    'A basic savings bank account for people who do not have a bank account.',
    '{"requirements": "For people without an existing bank account, subject to bank KYC rules."}'::jsonb,
    'No minimum balance is required for the basic savings account.',
    NULL,
    'Contact a bank branch or Bank Mitra for account opening and identity verification.',
    'https://pmjdy.gov.in/scheme-detail.aspx'
  ),
  (
    'Pradhan Mantri Matru Vandana Yojana',
    'Ministry of Women and Child Development',
    'women',
    'Maternity support for eligible pregnant women and lactating mothers.',
    '{"gender": "female", "requirements": "Check the official eligibility and birth-order criteria."}'::jsonb,
    'Cash assistance is paid by direct benefit transfer after scheme conditions are met.',
    NULL,
    'Check the official scheme page for registration or ask your local Anganwadi worker.',
    'https://wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana'
  ),
  (
    'Ayushman Bharat PM-JAY',
    'National Health Authority',
    'health',
    'Hospital care coverage for eligible beneficiaries at empanelled hospitals.',
    '{"requirements": "Use the beneficiary portal to check eligibility."}'::jsonb,
    'Cashless access to covered hospital treatment at participating hospitals.',
    NULL,
    'Check eligibility and follow the Ayushman card instructions on the beneficiary portal.',
    'https://beneficiary.nha.gov.in/'
  ),
  (
    'National Means-cum-Merit Scholarship Scheme',
    'Department of School Education and Literacy',
    'education',
    'Scholarships intended to help eligible students continue in school after Class VIII.',
    '{"occupation": "Student", "requirements": "Income, school type and state selection test rules apply."}'::jsonb,
    'Scholarship support for eligible selected students in Classes IX to XII.',
    NULL,
    'Check current application dates with your state or school and follow the official scheme instructions.',
    'https://www.education.gov.in/en/national-means-cum-merit-scholarship-scheme-nmmss'
  )
)
INSERT INTO public.schemes (name, ministry_department, category, description, eligibility_criteria, benefits, benefit_amount, application_process, official_link)
SELECT starter.name, starter.ministry_department, starter.category, starter.description, starter.eligibility_criteria, starter.benefits, starter.benefit_amount, starter.application_process, starter.official_link
FROM starter_schemes AS starter
WHERE NOT EXISTS (
  SELECT 1
  FROM public.schemes AS existing
  WHERE existing.state IS NULL
    AND (
      lower(existing.name) = lower(starter.name)
      OR (starter.name = 'Ayushman Bharat PM-JAY' AND lower(existing.name) = 'ayushman bharat')
    )
);
