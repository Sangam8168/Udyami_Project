-- Keep historical scores while allowing new repayment estimates without a credit score.
ALTER TABLE public.credit_assessments
  ALTER COLUMN credit_score DROP NOT NULL,
  ADD COLUMN loan_amount integer CHECK (loan_amount > 0),
  ADD COLUMN annual_interest_rate numeric(5, 2) CHECK (annual_interest_rate BETWEEN 0 AND 100),
  ADD COLUMN term_months integer CHECK (term_months BETWEEN 1 AND 360),
  ADD COLUMN estimated_emi numeric(14, 2) CHECK (estimated_emi >= 0);
