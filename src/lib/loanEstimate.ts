export type LoanPlan = {
  income: number;
  expenses: number;
  existingEmis: number;
  savings: number;
  principal: number;
  annualRate: number;
  months: number;
};

export function estimateLoan(plan: LoanPlan) {
  const { income, expenses, existingEmis, savings, principal, annualRate, months } = plan;
  const rate = annualRate / 1200;
  const monthlyPayment = rate === 0
    ? principal / months
    : (principal * rate) / -Math.expm1(-months * Math.log1p(rate));
  const totalRepayment = monthlyPayment * months;
  const monthlyOutgo = expenses + existingEmis + monthlyPayment;
  const cashBeforeLoan = income - expenses - existingEmis;

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest: Math.max(0, totalRepayment - principal),
    cashBeforeLoan,
    cashAfterLoan: Math.round((cashBeforeLoan - monthlyPayment) * 100) / 100,
    savingsMonths: savings / monthlyOutgo,
  };
}
