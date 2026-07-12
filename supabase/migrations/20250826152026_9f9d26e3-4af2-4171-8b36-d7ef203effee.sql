-- Add more comprehensive government schemes for better recommendations
INSERT INTO public.schemes (
  name, ministry_department, category, state, description, benefits, benefit_amount,
  eligibility_criteria, application_process, official_link, documents_required, is_active
) VALUES 
-- More Women Empowerment Schemes
('Mahila Samman Savings Certificate', 'Ministry of Finance', 'women', NULL, 'Special savings scheme for women with attractive interest rates', 'Higher interest rates than regular savings, tax benefits', '7.5% annual interest', '{"age": "any", "gender": "female", "citizenship": "indian"}', 'Apply through post office or bank', 'https://www.indiapost.gov.in/', ARRAY['ID Proof', 'Address Proof', 'Bank Account Details'], true),

('Stand Up India Scheme', 'Ministry of Finance', 'women', NULL, 'Bank loans for SC/ST and women entrepreneurs', 'Loans for setting up greenfield enterprises', '₹10 lakh to ₹1 crore', '{"gender": "female", "business_type": "new_enterprise"}', 'Apply through scheduled commercial banks', 'https://www.standupmitra.in/', ARRAY['Business Plan', 'Project Report', 'ID Proof', 'Caste Certificate'], true),

('Stree Shakti Package for Women Entrepreneurs', 'State Bank of India', 'women', NULL, 'Concessional loans for women entrepreneurs', 'Reduced interest rates, collateral-free loans up to ₹2 lakh', 'Interest rate concessions', '{"gender": "female", "business_ownership": "minimum_51_percent"}', 'Apply through SBI branches', 'https://bank.sbi/', ARRAY['Business Registration', 'Income Proof', 'Project Report'], true),

-- Agriculture Schemes
('PM Kisan Maandhan Yojana', 'Ministry of Agriculture', 'agriculture', NULL, 'Pension scheme for small and marginal farmers', 'Monthly pension of ₹3000 after 60 years', '₹3000 monthly pension', '{"age": "18-40", "land_holding": "up_to_2_hectares"}', 'Apply through CSC or agriculture office', 'https://pmkmy.gov.in/', ARRAY['Land Records', 'Aadhaar Card', 'Bank Account'], true),

('Pradhan Mantri Fasal Bima Yojana', 'Ministry of Agriculture', 'agriculture', NULL, 'Crop insurance scheme for farmers', 'Insurance coverage for crop loss', 'Up to ₹2 lakh per farmer', '{"occupation": "farmer", "crop_type": "notified_crops"}', 'Apply through banks or insurance companies', 'https://pmfby.gov.in/', ARRAY['Land Records', 'Sowing Certificate', 'Bank Account'], true),

('Soil Health Card Scheme', 'Ministry of Agriculture', 'agriculture', NULL, 'Soil testing and nutrient management', 'Free soil testing and recommendations', 'Free soil testing', '{"occupation": "farmer"}', 'Contact agriculture extension officer', 'https://soilhealth.dac.gov.in/', ARRAY['Land Records', 'Farmer ID'], true),

-- Education Schemes
('Post Matric Scholarship for SC Students', 'Ministry of Social Justice', 'education', NULL, 'Scholarship for SC students for higher education', 'Financial assistance for studies', 'Up to ₹2 lakh per year', '{"caste": "sc", "education_level": "post_matric", "family_income": "below_2.5_lakh"}', 'Apply through National Scholarship Portal', 'https://scholarships.gov.in/', ARRAY['Caste Certificate', 'Income Certificate', 'Educational Documents'], true),

('Central Sector Scholarship Scheme', 'Ministry of Education', 'education', NULL, 'Merit-based scholarship for college students', 'Annual scholarship for degree courses', '₹12,000 to ₹20,000 per year', '{"class_12_percentage": "above_80", "family_income": "below_8_lakh"}', 'Apply online through NSP', 'https://scholarships.gov.in/', ARRAY['12th Marksheet', 'Income Certificate', 'College Admission Proof'], true),

-- Health Schemes
('Rashtriya Swasthya Bima Yojana', 'Ministry of Health', 'health', NULL, 'Health insurance for BPL families', 'Cashless medical treatment', 'Up to ₹30,000 per family per year', '{"economic_status": "bpl", "family_type": "nuclear"}', 'Apply through district health office', 'https://www.rsby.gov.in/', ARRAY['BPL Card', 'Family Photo', 'Address Proof'], true),

('Janani Suraksha Yojana', 'Ministry of Health', 'health', NULL, 'Safe motherhood intervention for pregnant women', 'Cash assistance for institutional delivery', '₹1400 for rural, ₹1000 for urban areas', '{"gender": "female", "pregnancy_status": "pregnant", "delivery_type": "institutional"}', 'Register at nearest health center', 'https://nhm.gov.in/jsy', ARRAY['Pregnancy Card', 'ID Proof', 'Bank Account'], true),

-- Employment Schemes
('Deen Dayal Upadhyaya Grameen Kaushalya Yojana', 'Ministry of Rural Development', 'employment', NULL, 'Skill development program for rural youth', 'Free training and job placement assistance', 'Free training + placement support', '{"age": "15-35", "location_type": "rural", "education": "minimum_class_5"}', 'Apply through skill training centers', 'https://ddugky.gov.in/', ARRAY['Age Proof', 'Educational Certificate', 'Rural Residence Proof'], true),

('Pradhan Mantri Kaushal Vikas Yojana', 'Ministry of Skill Development', 'employment', NULL, 'Skill development and certification program', 'Free skill training and monetary rewards', '₹8000 reward on completion', '{"age": "18-45", "education": "school_dropout_or_unemployed"}', 'Enroll through PMKVY centers', 'https://pmkvyofficial.org/', ARRAY['Age Proof', 'ID Proof', 'Bank Account'], true),

-- State-specific schemes
('Ladli Beti Scheme', 'Government of Haryana', 'women', 'Haryana', 'Financial assistance for girl child education', 'Cash incentives for education milestones', '₹5000 to ₹25000 at different stages', '{"gender": "female", "state": "haryana", "birth_year": "2005_onwards"}', 'Apply through anganwadi or school', 'https://haryana.gov.in/', ARRAY['Birth Certificate', 'School Enrollment', 'Bank Account'], true),

('Mukhyamantri Kanya Utthan Yojana', 'Government of Bihar', 'education', 'Bihar', 'Financial incentive for girls education from birth to graduation', 'Progressive cash incentives', 'Up to ₹50,000 total', '{"gender": "female", "state": "bihar", "education_status": "enrolled"}', 'Apply through school or college', 'https://edudbt.bih.nic.in/', ARRAY['Birth Certificate', 'Educational Documents', 'Caste Certificate'], true),

('Amma Vodi Scheme', 'Government of Andhra Pradesh', 'education', 'Andhra Pradesh', 'Financial assistance for mothers of school children', 'Annual payment for children education', '₹15,000 per year per child', '{"children_education": "school_enrolled", "state": "andhra_pradesh"}', 'Apply through school', 'https://ap.gov.in/', ARRAY['School Enrollment Certificate', 'Mother ID Proof', 'Bank Account'], true),

('Tamil Nadu Nutritious Meal Programme', 'Government of Tamil Nadu', 'health', 'Tamil Nadu', 'Free nutritious meals for school children', 'Daily nutritious meals', 'Free meals', '{"age": "school_age", "state": "tamil_nadu", "school_type": "government"}', 'Automatic enrollment in government schools', 'https://tn.gov.in/', ARRAY['School Enrollment'], true),

('Kerala Pension for Agricultural Workers', 'Government of Kerala', 'agriculture', 'Kerala', 'Pension scheme for agricultural laborers', 'Monthly pension for aged agricultural workers', '₹1200 per month', '{"age": "above_60", "occupation": "agricultural_laborer", "state": "kerala"}', 'Apply through local panchayat', 'https://kerala.gov.in/', ARRAY['Age Proof', 'Work Certificate', 'Bank Account'], true);