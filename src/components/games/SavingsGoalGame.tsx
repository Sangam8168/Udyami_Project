import { useState } from "react";
import { Calculator, SlidersHorizontal, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { describeSavingsPlan, type SavingsInputs } from "@/lib/savingsPlan";

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const goals = [
  { id: "emergency", label: "आपातकालीन फंड (Emergency fund)", target: 24_000, saved: 6_000, months: 6 },
  { id: "education", label: "शिक्षा (Education)", target: 36_000, saved: 6_000, months: 12 },
  { id: "house", label: "घर (House down payment)", target: 200_000, saved: 20_000, months: 36 },
  { id: "wedding", label: "शादी (Wedding)", target: 150_000, saved: 15_000, months: 24 },
  { id: "business", label: "व्यापार (Business equipment)", target: 60_000, saved: 12_000, months: 12 },
  { id: "custom", label: "Custom goal", target: 0, saved: 0, months: 12 },
];

const fields = [
  { key: "target", label: "Goal amount (₹)", min: 1 },
  { key: "saved", label: "Already set aside for this goal (₹)", min: 0 },
  { key: "months", label: "Months to save", min: 1, max: 120 },
  { key: "income", label: "Monthly take-home income (₹)", min: 0 },
  { key: "expenses", label: "Monthly expenses and EMIs (₹)", min: 0 },
  { key: "contribution", label: "Planned monthly deposit (₹)", min: 0 },
] satisfies { key: keyof SavingsInputs; label: string; min: number; max?: number }[];

const initial = { target: "24000", saved: "6000", months: "6", income: "15000", expenses: "13000", contribution: "2000" };

const question = [
  { label: "The full goal amount", reason: "This ignores money already set aside and could overstate the monthly target." },
  { label: "The amount still needed after subtracting existing goal savings", reason: "You only need to fund the remaining gap. Divide that amount by the months left." },
  { label: "The income left after monthly bills", reason: "That tells you what your budget can afford. Use it to check the plan after calculating the goal’s monthly target." },
];

export default function SavingsGoalGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [goal, setGoal] = useState("emergency");
  const [title, setTitle] = useState("");
  const [plan, setPlan] = useState(initial);
  const [answer, setAnswer] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const work = {
    target: Number(plan.target), saved: Number(plan.saved), months: Number(plan.months),
    income: Number(plan.income), expenses: Number(plan.expenses), contribution: Number(plan.contribution),
  };
  const valid = fields.every(({ key, min, max }) => plan[key] !== "" &&
    Number.isInteger(work[key]) && work[key] >= min && work[key] <= (max ?? 1_000_000_000));
  const outcome = valid ? describeSavingsPlan(work) : null;

  const patch = (change: Partial<typeof initial>) => {
    setPlan(previous => ({ ...previous, ...change }));
  };

  const chooseGoal = (id: string) => {
    const selected = goals.find(item => item.id === id);
    if (!selected) return;
    setGoal(id);
    patch({ target: selected.target ? String(selected.target) : "", saved: String(selected.saved), months: String(selected.months) });
  };

  const submitAnswer = () => {
    if (reviewed || answer === "" || !outcome) return;
    setReviewed(true);
    onComplete(answer === "1" ? 100 : 0);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" aria-hidden="true" /> Build a plan</CardTitle>
            <CardDescription>Start with the example budget or try your own numbers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="savings-goal">Savings goal</Label>
              <Select value={goal} onValueChange={chooseGoal}>
                <SelectTrigger id="savings-goal"><SelectValue /></SelectTrigger>
                <SelectContent>{goals.map(item => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {goal === "custom" && <div className="space-y-2">
              <Label htmlFor="savings-goal-title">Goal name</Label>
              <Input id="savings-goal-title" value={title} maxLength={65} onChange={e => setTitle(e.target.value)} />
            </div>}
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ key, label, min, max }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`savings-${key}`}>{label}</Label>
                  <Input id={`savings-${key}`} type="number" inputMode="numeric" min={min} max={max ?? 1_000_000_000}
                    step={1} value={plan[key]} onChange={event => patch({ [key]: event.target.value })} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" aria-hidden="true" /> Savings forecast</CardTitle>
            <CardDescription>{goal === "custom" && title.trim() ? title.trim() + " · " : ""}Monthly deposits are added without interest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {outcome ? (
              <>
                <div className="rounded-lg border bg-accent/35 p-4">
                  <p className="font-semibold">
                    {outcome.remaining === 0 ? "Goal already funded" :
                      outcome.budgetGap > 0 ? "Your planned deposit exceeds your budget" :
                      outcome.goalGap > 0 ? `${rupees.format(outcome.goalGap)} left to fund by the deadline` : "Your plan reaches the goal"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    At {rupees.format(work.contribution)} per month, you’d have {rupees.format(outcome.projected)} in {work.months} months.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <h3 className="font-semibold">How the numbers work</h3>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li><strong>Amount still needed:</strong> {rupees.format(work.target)} target less {rupees.format(work.saved)} already saved leaves {rupees.format(outcome.remaining)}{outcome.remaining === 0 ? " to fund" : ""}.</li>
                    <li><strong>Monthly target:</strong> Divide {rupees.format(outcome.remaining)} by {work.months} months. Rounded up to the next rupee, that’s {rupees.format(outcome.monthlyRequired)} a month.</li>
                    <li><strong>Budget check:</strong> {rupees.format(work.income)} income less {rupees.format(work.expenses)} in bills leaves {rupees.format(outcome.available)} before saving.</li>
                  </ol>
                  {outcome.budgetGap > 0 && <p className="text-destructive">The plan is {rupees.format(outcome.budgetGap)} over the current budget each month.</p>}
                  {outcome.remaining > 0 && outcome.monthsNeeded !== null && (
                    <p>At this deposit amount, reaching the target takes {outcome.monthsNeeded} {outcome.monthsNeeded === 1 ? "month" : "months"} if you can maintain the deposits.</p>
                  )}
                </div>
                <div className="space-y-2 border-t pt-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Try a different plan</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" disabled={work.months >= 120} onClick={() => patch({ months: String(Math.min(120, work.months + 3)) })}>Add 3 months</Button>
                    <Button variant="outline" size="sm" disabled={work.contribution === outcome.monthlyRequired}
                      onClick={() => patch({ contribution: String(outcome.monthlyRequired) })}>Try the required deposit</Button>
                  </div>
                </div>
              </>
            ) : <p className="text-sm text-muted-foreground">Enter whole rupee amounts, a positive goal amount, and a timeline from 1 to 120 months.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-warm">
        <CardHeader><CardTitle>Check your understanding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <fieldset disabled={reviewed} className="space-y-3">
            <legend className="mb-3 font-semibold">What should you divide by the months left to find your monthly target?</legend>
            <RadioGroup disabled={reviewed} value={answer} onValueChange={setAnswer}>
              {question.map((item, index) => (
                <Label key={item.label} htmlFor={`savings-choice-${index}`} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 leading-relaxed">
                  <RadioGroupItem id={`savings-choice-${index}`} value={String(index)} />
                  {item.label}
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
          {reviewed ? (
            <div aria-live="polite" className="space-y-3 rounded-lg border bg-muted/35 p-4 text-sm">
              <p className="font-semibold">{answer === "1" ? "Correct choice" : "Review your choice"}</p>
              <p><strong>Best answer:</strong> {question[1].label}</p>
              <ul className="list-disc space-y-2 pl-5">
                {question.map(item => <li key={item.label}><strong>{item.label}.</strong> {item.reason}</li>)}
              </ul>
              <Button variant="outline" size="sm" onClick={() => { setAnswer(""); setReviewed(false); }}>Try the question again</Button>
            </div>
          ) : <Button onClick={submitAnswer} disabled={!outcome || answer === ""}>Check answer</Button>}
        </CardContent>
      </Card>
    </div>
  );
}
