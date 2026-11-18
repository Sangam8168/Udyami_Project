import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type Lesson = {
  title: string;
  scenario: string;
  facts?: { label: string; value: string }[];
  question: string;
  hint: string;
  choices: { label: string; reason: string }[];
  answer: number;
  steps: string[];
  takeaway: string;
};

export type Level = { name: string; description: string; seconds: number; lessons: Lesson[] };
type Attempt = { lesson: Lesson; choice: number | null };

function Review({ lesson, choice }: Attempt) {
  const correct = choice === lesson.answer;
  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <p className="font-semibold">{correct ? "Correct choice" : choice === null ? "Time’s up" : "Review your choice"}</p>
        {choice !== null && !correct && <p>Your choice: {lesson.choices[choice].label}</p>}
        <p><strong>Best answer:</strong> {lesson.choices[lesson.answer].label}</p>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Why it works</h3>
        <ol className="list-decimal space-y-1.5 pl-5">
          {lesson.steps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Compare the choices</h3>
        <ul className="space-y-2">
          {lesson.choices.map((option, index) => (
            <li key={option.label} className="rounded-lg border bg-card p-3">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                {option.label}
                {index === lesson.answer && <Badge variant="secondary">Best answer</Badge>}
              </p>
              <p className="mt-1 text-muted-foreground">{option.reason}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="rounded-lg border border-primary/20 bg-primary/5 p-3"><strong>Remember:</strong> {lesson.takeaway}</p>
    </div>
  );
}

export default function LearningQuiz({ levels, onComplete }: { levels: Level[]; onComplete: (score: number) => void }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [timed, setTimed] = useState(false);
  const [round, setRound] = useState<Lesson[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Attempt | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [finished, setFinished] = useState(false);
  const [practiceMisses, setPracticeMisses] = useState(false);
  const lesson = round[index];

  useEffect(() => {
    if (!timed || !level || !lesson || feedback || finished || practiceMisses) return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1_000));
      setRemaining(seconds);
      if (seconds === 0) setFeedback(current => current ?? { lesson, choice: null });
    };
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [timed, level, lesson, feedback, finished, deadline, practiceMisses]);

  const resetQuestion = (seconds: number) => {
    setSelected(null);
    setFeedback(null);
    setHintOpen(false);
    setRemaining(seconds);
    setDeadline(Date.now() + seconds * 1_000);
  };

  const start = (chosen: Level, lessons = chosen.lessons, missedOnly = false) => {
    setLevel(chosen);
    setRound(lessons);
    setIndex(0);
    setAttempts([]);
    setPracticeMisses(missedOnly);
    setFinished(false);
    resetQuestion(chosen.seconds);
  };

  const checkAnswer = () => {
    if (!lesson || selected === null || feedback) return;
    const expired = timed && !practiceMisses && Date.now() >= deadline;
    setFeedback(current => current ?? { lesson, choice: expired ? null : selected });
  };

  const next = () => {
    if (!feedback || finished) return;
    const results = [...attempts, feedback];
    setAttempts(results);
    if (index + 1 < round.length) {
      setIndex(index + 1);
      resetQuestion(level.seconds);
      return;
    }
    setFinished(true);
    if (!practiceMisses) {
      const correct = results.filter(item => item.choice === item.lesson.answer).length;
      onComplete(Math.round(correct / results.length * 100));
    }
  };

  if (!level) {
    return (
      <Card className="max-w-4xl shadow-warm">
        <CardHeader>
          <CardTitle>Choose a level</CardTitle>
          <CardDescription>Use hints when you need them and review the reasoning at your own pace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <Switch id="timed-challenge" checked={timed} onCheckedChange={setTimed} />
            <Label htmlFor="timed-challenge">Timed challenge</Label>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {levels.map(chosen => (
              <Button key={chosen.name} type="button" variant="outline" onClick={() => start(chosen)} className="h-auto flex-col items-start whitespace-normal p-4 text-left">
                <span className="text-base font-semibold">{chosen.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{chosen.description}</span>
                <span className="text-xs text-muted-foreground">{chosen.lessons.length} scenarios{timed ? ` · ${chosen.seconds}s each` : ""}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const missed = attempts.filter(item => item.choice !== item.lesson.answer);
    return (
      <Card className="max-w-4xl shadow-warm">
        <CardHeader>
          <CardTitle>Round complete</CardTitle>
          <CardDescription>{round.length - missed.length} of {round.length} correct · {level.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {missed.length > 0 && <Button onClick={() => start(level, missed.map(item => item.lesson), true)}>Practise missed scenarios</Button>}
            <Button variant="outline" onClick={() => start(level)}>Replay level</Button>
            <Button variant="ghost" onClick={() => setLevel(null)}>Choose another level</Button>
          </div>
          <h3 className="font-semibold">Review your decisions</h3>
          {attempts.map(item => (
            <details key={item.lesson.title} className="rounded-lg border bg-muted/30 p-4">
              <summary className="cursor-pointer font-medium">{item.lesson.title} · {item.choice === item.lesson.answer ? "Correct" : "Review"}</summary>
              <div className="mt-4"><Review {...item} /></div>
            </details>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl shadow-warm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{practiceMisses ? "Review practice" : level.name} · Scenario {index + 1} of {round.length}</span>
          {timed && !practiceMisses && !feedback && (
            <span role="timer" aria-live="off" className="flex items-center gap-1 tabular-nums"><Clock3 className="h-4 w-4" aria-hidden="true" /> {remaining}s</span>
          )}
        </div>
        <Progress aria-label="Scenarios checked" value={(index + Number(Boolean(feedback))) / round.length * 100} />
        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>{lesson.scenario}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {lesson.facts && (
          <dl className="grid gap-3 rounded-lg border bg-accent/30 p-4 sm:grid-cols-2">
            {lesson.facts.map(({ label, value }) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
          </dl>
        )}
        <fieldset className="space-y-3" disabled={Boolean(feedback)}>
          <legend className="mb-3 font-semibold">{lesson.question}</legend>
          <RadioGroup disabled={Boolean(feedback)} value={selected === null ? "" : String(selected)} onValueChange={value => setSelected(Number(value))}>
            {lesson.choices.map((option, choice) => (
              <Label key={option.label} htmlFor={`lesson-choice-${choice}`} className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 leading-relaxed",
                selected === choice && "border-primary bg-accent/40",
                feedback && choice === lesson.answer && "border-primary/50 bg-primary/10",
              )}>
                <RadioGroupItem id={`lesson-choice-${choice}`} value={String(choice)} />
                <span className="flex-1">{option.label}</span>
                {feedback && choice === lesson.answer && <Check className="h-4 w-4 text-primary" aria-label="Best answer" />}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>

        {feedback ? (
          <>
            <section aria-live="polite" className="rounded-xl border bg-muted/40 p-4">
              <Review {...feedback} />
            </section>
            <Button onClick={next}>
              {index + 1 === round.length ? "See round summary" : "Next scenario"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button onClick={checkAnswer} disabled={selected === null}>Check answer</Button>
              <Button variant="outline" onClick={() => setHintOpen(open => !open)} aria-expanded={hintOpen}>
                <Lightbulb className="h-4 w-4" aria-hidden="true" />{hintOpen ? "Hide hint" : "Show hint"}
              </Button>
            </div>
            {hintOpen && <p className="rounded-lg bg-accent/40 p-3 text-sm">{lesson.hint}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
