import { useRef, useState, type FormEvent } from "react";
import { Calculator, CircleAlert, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { estimateLoan, type LoanPlan } from "@/lib/loanEstimate";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

const initialFields: Record<keyof LoanPlan, string> = {
  income: "",
  expenses: "",
  existingEmis: "",
  savings: "",
  principal: "",
  annualRate: "",
  months: "24",
};

const monthlyFields = [
  { key: "income", label: "मासिक आय (Take-home income)", unit: "₹", placeholder: "25000", min: 0, max: 1_000_000_000, required: true },
  { key: "expenses", label: "घर का मासिक खर्च (Household expenses)", unit: "₹", placeholder: "15000", min: 0, max: 1_000_000_000, required: true },
  { key: "existingEmis", label: "मौजूदा मासिक EMI (Existing monthly EMIs)", unit: "₹", placeholder: "0", min: 0, max: 1_000_000_000 },
  { key: "savings", label: "उपलब्ध बचत (Available savings)", unit: "₹", placeholder: "0", min: 0, max: 1_000_000_000 },
] as const;

const loanFields = [
  { key: "principal", label: "लोन राशि (Loan amount)", unit: "₹", placeholder: "50000", min: 1, max: 1_000_000_000, required: true },
  { key: "annualRate", label: "सालाना ब्याज दर (Annual interest rate)", unit: "%", placeholder: "12", min: 0, max: 100, step: 0.01, required: true },
  { key: "months", label: "लोन अवधि (Term in months)", placeholder: "24", min: 1, max: 360, required: true },
] as const;

type Field = {
  key: keyof LoanPlan;
  label: string;
  unit?: string;
  placeholder: string;
  min: number;
  max: number;
  step?: number;
  required?: boolean;
};

type Assessment = {
  id: string;
  plan: LoanPlan;
  estimate: ReturnType<typeof estimateLoan>;
};

export default function CreditEstimator() {
  const { user, loading: authLoading } = useAuth();
  const [fields, setFields] = useState(initialFields);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savePending = useRef(false);

  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const plan: LoanPlan = {
      income: Number(fields.income),
      expenses: Number(fields.expenses),
      existingEmis: Number(fields.existingEmis),
      savings: Number(fields.savings),
      principal: Number(fields.principal),
      annualRate: Number(fields.annualRate),
      months: Number(fields.months),
    };
    setAssessment({ id: crypto.randomUUID(), plan, estimate: estimateLoan(plan) });
    setSaveState("idle");
  };

  const saveAssessment = async () => {
    if (!user || !assessment || savePending.current || saveState === "saved") return;
    savePending.current = true;
    setSaveState("saving");

    const { id, plan, estimate } = assessment;
    try {
      const { error } = await supabase.from("credit_assessments").upsert({
        id,
        user_id: user.id,
        monthly_income: plan.income,
        monthly_expenses: plan.expenses,
        existing_loans: plan.existingEmis,
        savings: plan.savings,
        credit_score: null,
        risk_level: "Unrated",
        loan_amount: plan.principal,
        annual_interest_rate: plan.annualRate,
        term_months: plan.months,
        estimated_emi: Number(estimate.monthlyPayment.toFixed(2)),
      }, { onConflict: "id", ignoreDuplicates: true });

      if (error) throw error;
      setSaveState("saved");
    } catch {
      setSaveState("error");
    } finally {
      savePending.current = false;
    }
  };

  const renderField = ({ key, label, unit, ...constraints }: Field) => (
    <div key={key} className="space-y-2">
      <Label htmlFor={key}>{label}{unit ? ` (${unit})` : ""}</Label>
      <Input
        id={key}
        type="number"
        inputMode={constraints.step ? "decimal" : "numeric"}
        value={fields[key]}
        onChange={(event) => {
          setFields({ ...fields, [key]: event.target.value });
          setAssessment(null);
          setSaveState("idle");
        }}
        {...constraints}
      />
    </div>
  );

  const estimate = assessment?.estimate;
  const saving = saveState === "saving";

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <header className="mb-8 max-w-2xl space-y-3">
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Calculator className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
            क्रेडिट एस्टिमेटर (Credit Estimator)
          </h1>
          <p className="text-muted-foreground">
            अपनी आय और खर्च से मासिक किस्त का अनुमान लगाएं। Check how a loan payment would fit into your monthly budget.
          </p>
        </header>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle>मासिक बजट (Monthly budget)</CardTitle>
              <CardDescription>Enter monthly amounts after taxes. Leave loan payments out of household expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculate}>
                <fieldset disabled={saving} className="space-y-6">
                  <div className="space-y-4">{monthlyFields.map(renderField)}</div>
                  <div className="space-y-4 border-t pt-5">
                    <h2 className="font-semibold">लोन की शर्तें (Loan terms)</h2>
                    <p className="text-sm text-muted-foreground">Use the quoted annual interest rate for a reducing-balance loan.</p>
                    {loanFields.map(renderField)}
                  </div>
                  <Button type="submit" className="w-full">किस्त का अनुमान लगाएं (Estimate EMI)</Button>
                </fieldset>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" aria-hidden="true" />
                किस्त का अनुमान (Repayment estimate)
              </CardTitle>
              <CardDescription>Fixed-rate estimate. Fees are excluded. Lenders determine approval.</CardDescription>
            </CardHeader>
            <CardContent>
              {estimate ? (
                <div className="space-y-5">
                  <div role="status" className="rounded-lg bg-primary/10 p-4">
                    <p className="text-sm font-medium">मासिक किस्त (Estimated monthly EMI)</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums">{currency.format(estimate.monthlyPayment)}</p>
                  </div>

                  <dl className="space-y-3 text-sm tabular-nums">
                    <div className="flex justify-between gap-3">
                      <dt>Budget before new EMI</dt>
                      <dd>{currency.format(estimate.cashBeforeLoan)}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b pb-3 font-semibold">
                      <dt>{estimate.cashAfterLoan < 0 ? "Monthly shortfall" : "Budget left after new EMI"}</dt>
                      <dd>{currency.format(Math.abs(estimate.cashAfterLoan))}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Total interest</dt>
                      <dd>{currency.format(estimate.totalInterest)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Total repayment</dt>
                      <dd>{currency.format(estimate.totalRepayment)}</dd>
                    </div>
                    {assessment.plan.savings > 0 && (
                      <div className="flex justify-between gap-3">
                        <dt>Months of expenses and EMIs covered by savings</dt>
                        <dd>{estimate.savingsMonths.toLocaleString("en-IN", { maximumFractionDigits: 1 })}</dd>
                      </div>
                    )}
                  </dl>

                  {estimate.cashAfterLoan <= 0 && (
                    <p className="flex gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {estimate.cashAfterLoan < 0
                        ? "This payment exceeds the amount left in your monthly budget."
                        : "This payment uses the full amount left in your monthly budget."}
                    </p>
                  )}

                  {!authLoading && user && (
                    <div className="space-y-2 border-t pt-4">
                      <Button variant="outline" onClick={saveAssessment} disabled={saving || saveState === "saved"}>
                        {saving ? "Saving…" : saveState === "saved" ? "Estimate saved" : "Save to my account"}
                      </Button>
                      {saveState === "error" && (
                        <p role="alert" className="text-sm text-destructive">Could not save this estimate. Your results are still here.</p>
                      )}
                    </div>
                  )}
                  {!authLoading && !user && (
                    <p className="text-sm text-muted-foreground">
                      Your numbers stay on this page. <Link to="/auth" className="underline">Sign in</Link> to save future estimates.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter your budget and loan terms to see your monthly payment, total interest, and what remains each month.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
