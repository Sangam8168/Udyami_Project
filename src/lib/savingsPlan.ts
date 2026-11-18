export type SavingsInputs = {
  target: number;
  saved: number;
  months: number;
  income: number;
  expenses: number;
  contribution: number;
};

export function describeSavingsPlan({ target, saved, months, income, expenses, contribution }: SavingsInputs) {
  const remaining = Math.max(0, target - saved);
  const available = income - expenses;
  const monthlyRequired = Math.ceil(remaining / months);
  const projected = saved + contribution * months;
  return {
    remaining,
    available,
    monthlyRequired,
    projected,
    goalGap: Math.max(0, target - projected),
    budgetGap: Math.max(0, contribution - available),
    monthsNeeded: remaining === 0 ? 0 : contribution > 0 ? Math.ceil(remaining / contribution) : null,
  };
}
