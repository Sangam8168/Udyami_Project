import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, PiggyBank, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AdvancedBudgetingGame from "@/components/games/AdvancedBudgetingGame";
import AdvancedFraudQuiz from "@/components/games/AdvancedFraudQuiz";
import SavingsGoalGame from "@/components/games/SavingsGoalGame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const games = [
  { id: "budgeting", name: "Budgeting Challenge", hindi: "बजट चुनौती", detail: "Practise making room for essentials, savings, and loan payments.", icon: Calculator, component: AdvancedBudgetingGame },
  { id: "savings", name: "Savings Goal Planner", hindi: "बचत लक्ष्य", detail: "Set a goal and see how changing the deposit or deadline affects your plan.", icon: PiggyBank, component: SavingsGoalGame },
  { id: "fraud", name: "Fraud Detection Quiz", hindi: "धोखाधड़ी पहचान", detail: "Read realistic practice messages and choose your safest next action.", icon: ShieldCheck, component: AdvancedFraudQuiz },
] as const;

type GameId = typeof games[number]["id"];
type Scores = Partial<Record<GameId, number>>;
const storageKey = "udyami-learning-games-progress";
const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

function readDeviceScores(): Scores {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    return Object.fromEntries(games.flatMap(({ id }) => typeof saved?.[id] === "number" && Number.isFinite(saved[id])
      ? [[id, clampScore(saved[id])]]
      : []));
  } catch {
    return {};
  }
}

function updateScore(scores: Scores, id: GameId, score: number): Scores {
  return { ...scores, [id]: Math.max(scores[id] ?? 0, clampScore(score)) };
}

export default function Games() {
  const [selected, setSelected] = useState<GameId | null>(null);
  const [deviceScores, setDeviceScores] = useState(readDeviceScores);
  const [account, setAccount] = useState<{ id: string; scores: Scores } | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(deviceScores));
    } catch {
      // Progress stays available for this visit when browser storage is unavailable.
    }
  }, [deviceScores]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void Promise.all(games.map(async ({ id }) => {
      const { data } = await supabase.from("game_scores")
        .select("score")
        .eq("user_id", userId)
        .eq("game_id", id)
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle();
      return { id, score: data?.score };
    })).then(records => {
      if (cancelled) return;
      setAccount(previous => {
        const scores = records.reduce<Scores>((best, record) => record.score == null
          ? best
          : updateScore(best, record.id, record.score), previous?.id === userId ? previous.scores : {});
        return { id: userId, scores };
      });
    });
    return () => { cancelled = true; };
  }, [userId]);

  const complete = async (id: GameId, score: number) => {
    const result = clampScore(score);
    if (!userId) {
      setDeviceScores(previous => updateScore(previous, id, result));
      return;
    }

    setAccount(previous => ({
      id: userId,
      scores: updateScore(previous?.id === userId ? previous.scores : {}, id, result),
    }));
    try {
      const { error } = await supabase.from("game_scores").insert({ user_id: userId, game_id: id, score: result });
      if (error) throw error;
    } catch {
      toast({ title: "Score could not be saved to your account", description: "Your round and its explanations are still available.", variant: "destructive" });
    }
  };

  const active = games.find(game => game.id === selected);
  const scores = userId ? (account?.id === userId ? account.scores : {}) : deviceScores;
  const completed = Object.keys(scores).length;

  return (
    <Layout>
      <div className="container mx-auto space-y-7 px-4 py-8 sm:py-12">
        {active ? (
          <>
            <header className="space-y-3">
              <Button variant="ghost" className="-ml-3" onClick={() => setSelected(null)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All games</Button>
              <h1 className="text-3xl font-bold">{active.name}</h1>
              <p className="text-muted-foreground">{active.detail}</p>
            </header>
            <active.component onComplete={score => { void complete(active.id, score); }} />
          </>
        ) : (
          <>
            <header className="space-y-3">
              <h1 className="text-3xl font-bold sm:text-4xl">वित्तीय शिक्षा खेल (Financial Learning Games)</h1>
              <p className="text-muted-foreground">Make a choice, check your reasoning, and try the lesson again whenever you like.</p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{completed} of {games.length} games completed</Badge>
                {!authLoading && !userId && <p className="text-sm text-muted-foreground">Progress is saved in this browser. <Link to="/auth" className="underline">Sign in</Link> to track scores in your account.</p>}
              </div>
            </header>
            <div className="grid gap-5 md:grid-cols-3">
              {games.map(game => (
                <Card key={game.id} className="flex flex-col shadow-warm">
                  <CardHeader className="space-y-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                      <game.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <CardTitle className="text-xl">{game.name}</CardTitle>
                      <CardDescription className="mt-1">{game.hindi}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col items-start gap-4">
                    <p className="flex-1 text-sm text-muted-foreground">{game.detail}</p>
                    {scores[game.id] !== undefined && <Badge variant="outline">Best score {scores[game.id]}%</Badge>}
                    <Button onClick={() => setSelected(game.id)} className="w-full">
                      {scores[game.id] === undefined ? "Start game" : "Play again"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
