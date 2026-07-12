-- Insert sample government schemes
INSERT INTO schemes (
  name, 
  ministry_department, 
  category, 
  state, 
  description, 
  benefits, 
  benefit_amount,
  eligibility_criteria, 
  application_process, 
  documents_required, 
  official_link,
  application_deadline,
  is_active
) VALUES 
(
  'Pradhan Mantri Jan Dhan Yojana',
  'Ministry of Finance',
  'finance',
  NULL,
  'Financial Inclusion Programme for providing universal access to banking facilities',
  'Zero balance account, RuPay debit card, accident insurance cover, life insurance cover',
  'Up to ₹10,000 overdraft facility',
  '{"age_min": 10, "income_level": ["low", "middle"], "location_type": ["rural", "urban"], "occupation": ["any"]}',
  'Visit nearest bank branch with required documents and fill application form',
  ARRAY['Aadhaar Card', 'PAN Card', 'Address Proof', 'Passport Size Photo'],
  'https://www.pmjdy.gov.in/',
  NULL,
  true
),
(
  'Pradhan Mantri Kaushal Vikas Yojana',
  'Ministry of Skill Development',
  'employment',
  NULL,
  'Skill development scheme to enable Indian youth to take up industry-relevant skill training',
  'Free skill training, certification, placement assistance, monetary rewards',
  '₹8,000 average monetary reward per candidate',
  '{"age_min": 15, "age_max": 45, "education_level": ["Below 10th", "10th Pass", "12th Pass"], "location_type": ["rural", "urban"]}',
  'Register online or visit nearest training center',
  ARRAY['Aadhaar Card', 'Educational Certificate', 'Bank Account Details'],
  'https://www.pmkvyofficial.org/',
  '2024-12-31',
  true
),
(
  'Pradhan Mantri Matru Vandana Yojana',
  'Ministry of Women and Child Development',
  'women',
  NULL,
  'Maternity benefit scheme for pregnant and lactating mothers',
  'Direct cash transfer for better health and nutrition during pregnancy',
  '₹5,000 in three installments',
  '{"gender": ["female"], "age_min": 19, "family_size": [1,2,3,4,5], "location_type": ["rural", "urban"]}',
  'Apply through Anganwadi Worker or Health Center',
  ARRAY['Aadhaar Card', 'Bank Account Details', 'MCP Card', 'Identity Proof'],
  'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana',
  NULL,
  true
),
(
  'PM-KISAN',
  'Ministry of Agriculture',
  'agriculture',
  NULL,
  'Income support scheme for farmers providing direct cash transfer',
  'Financial support to small and marginal farmers',
  '₹6,000 per year in three installments',
  '{"occupation": ["Farmer"], "location_type": ["rural"], "income_level": ["low", "middle"]}',
  'Online registration through PM-KISAN portal or Common Service Centers',
  ARRAY['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Mobile Number'],
  'https://pmkisan.gov.in/',
  NULL,
  true
),
(
  'Ayushman Bharat',
  'Ministry of Health and Family Welfare',
  'health',
  NULL,
  'National Health Protection Scheme providing health insurance coverage',
  'Cashless treatment in empaneled hospitals, coverage for secondary and tertiary care',
  'Up to ₹5 lakh per family per year',
  '{"income_level": ["low"], "location_type": ["rural", "urban"], "family_size": [1,2,3,4,5,6,7,8,9,10]}',
  'Visit nearest Common Service Center or Health and Wellness Center',
  ARRAY['Aadhaar Card', 'Ration Card', 'Mobile Number', 'Family Photo'],
  'https://pmjay.gov.in/',
  NULL,
  true
),
(
  'Beti Bachao Beti Padhao',
  'Ministry of Women and Child Development',
  'women',
  NULL,
  'Scheme to address declining Child Sex Ratio and empower girl children',
  'Awareness campaigns, educational support, financial incentives for girl education',
  'Varies by component and state',
  '{"gender": ["female"], "age_max": 18, "location_type": ["rural", "urban"]}',
  'Apply through district administration or educational institutions',
  ARRAY['Birth Certificate', 'Aadhaar Card', 'School Enrollment Certificate', 'Bank Account Details'],
  'https://wcd.nic.in/schemes/beti-bachao-beti-padhao-scheme',
  NULL,
  true
),
(
  'National Rural Employment Guarantee Act (MGNREGA)',
  'Ministry of Rural Development',
  'employment',
  NULL,
  'Employment guarantee scheme providing wage employment to rural households',
  'Guaranteed 100 days of employment per household per year',
  'State-wise minimum wages as per schedule',
  '{"location_type": ["rural"], "age_min": 18, "occupation": ["Unemployed", "Daily Wage Laborer", "Farmer"]}',
  'Apply through Gram Panchayat or online portal',
  ARRAY['Job Card', 'Aadhaar Card', 'Bank Account Details', 'Address Proof'],
  'https://nrega.nic.in/',
  NULL,
  true
),
(
  'Pradhan Mantri Awas Yojana',
  'Ministry of Housing and Urban Affairs',
  'finance',
  NULL,
  'Housing scheme to provide affordable housing to economically weaker sections',
  'Interest subsidy on home loans, direct assistance for house construction',
  'Up to ₹2.67 lakh subsidy on home loans',
  '{"income_level": ["low", "middle"], "location_type": ["rural", "urban"], "age_min": 18}',
  'Apply through banks, HFCs, or online portal',
  ARRAY['Aadhaar Card', 'Income Certificate', 'Property Documents', 'Bank Statements'],
  'https://pmaymis.gov.in/',
  '2024-12-31',
  true
);

-- Insert notification settings for existing users
INSERT INTO scheme_notifications (user_id, scheme_id, notification_type, message, is_read)
SELECT 
  p.user_id,
  s.id,
  'new_scheme',
  'New scheme available: ' || s.name,
  false
FROM profiles p
CROSS JOIN schemes s
WHERE s.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM scheme_notifications sn 
  WHERE sn.user_id = p.user_id AND sn.scheme_id = s.id
);