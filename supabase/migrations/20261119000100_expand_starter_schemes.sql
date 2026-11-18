-- Add more central schemes without replacing existing catalog entries.
WITH starter_schemes (name, ministry_department, category, description, eligibility_criteria, benefits, application_process, official_link) AS (
  VALUES
  (
    'PM Vishwakarma',
    'Ministry of Micro, Small and Medium Enterprises',
    'employment',
    'Training and business support for artisans and craftspeople in traditional trades.',
    '{"requirements": "For eligible artisans and craftspeople in trades covered by the scheme."}'::jsonb,
    'Skill training, toolkit support and access to concessional credit subject to scheme rules.',
    'Check the eligible trades on the official portal and visit a Common Service Centre to register.',
    'https://pmvishwakarma.gov.in/'
  ),
  (
    'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    'Ministry of Housing and Urban Affairs',
    'finance',
    'Working-capital assistance for eligible street vendors.',
    '{"requirements": "Check your vending documentation and eligibility with your urban local body."}'::jsonb,
    'Working-capital loans are available to eligible vendors, subject to the scheme terms.',
    'Contact your urban local body or use the official PM SVANidhi portal for application instructions.',
    'https://pmsvanidhi.mohua.gov.in/'
  ),
  (
    'Pradhan Mantri Ujjwala Yojana',
    'Ministry of Petroleum and Natural Gas',
    'women',
    'LPG connections for eligible women from low-income households.',
    '{"requirements": "The applicant must be an adult woman from an eligible household without an existing LPG connection."}'::jsonb,
    'Eligible households can receive a deposit-free LPG connection.',
    'See the official portal or contact an LPG distributor to check documents and apply.',
    'https://www.pmuy.gov.in/'
  ),
  (
    'Pradhan Mantri Fasal Bima Yojana',
    'Ministry of Agriculture and Farmers Welfare',
    'agriculture',
    'Crop insurance for eligible farmers growing notified crops in notified areas.',
    '{"requirements": "Check which crops, areas and seasons are notified in your state."}'::jsonb,
    'Insurance covers eligible crop losses from risks specified in the policy.',
    'Use the official farmer portal to check enrollment deadlines and register.',
    'https://pmfby.gov.in/home'
  )
)
INSERT INTO public.schemes (name, ministry_department, category, description, eligibility_criteria, benefits, application_process, official_link)
SELECT starter.name, starter.ministry_department, starter.category, starter.description, starter.eligibility_criteria, starter.benefits, starter.application_process, starter.official_link
FROM starter_schemes AS starter
WHERE NOT EXISTS (
  SELECT 1
  FROM public.schemes AS existing
  WHERE existing.state IS NULL
    AND (
      lower(existing.name) = lower(starter.name)
      OR rtrim(existing.official_link, '/') = rtrim(starter.official_link, '/')
    )
);
