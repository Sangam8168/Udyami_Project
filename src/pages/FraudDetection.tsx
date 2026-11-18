import { useRef, useState } from "react";
import { AlertTriangle, ArrowUpRight, Scan, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { analyzeFraud, checkFraudSignals, fraudCategoryLabel, fraudNextStep, type FraudResult } from "@/lib/fraudDetection";

export default function FraudDetection() {
  const { user, loading: authLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [requestedAi, setRequestedAi] = useState(false);
  const pending = useRef(false);

  const runCheck = async (useAi: boolean) => {
    const text = message.trim();
    if (!text || pending.current) return;

    setRequestedAi(useAi);
    if (!useAi) {
      setResult(checkFraudSignals(text));
      return;
    }

    pending.current = true;
    setAnalyzing(true);
    setResult(null);
    try {
      setResult(await analyzeFraud(text));
    } finally {
      pending.current = false;
      setAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
        <header className="space-y-3">
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Shield className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
            AI Fraud Detection
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Check a message for signs of a UPI scam, phishing, fake support, or a suspicious payment request.
          </p>
        </header>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Check a message</CardTitle>
              <CardDescription>Paste an SMS, WhatsApp message, or email in English or Hindi. Leave out any personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Paste the message here"
                  value={message}
                  maxLength={8_000}
                  disabled={analyzing}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setResult(null);
                  }}
                  className="min-h-40 resize-y"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {user && (
                  <Button onClick={() => runCheck(true)} disabled={analyzing || !message.trim()}>
                    <Scan className="h-4 w-4" aria-hidden="true" />
                    {analyzing ? "Analyzing…" : "Analyze with AI"}
                  </Button>
                )}
                <Button variant={user ? "outline" : "default"} onClick={() => runCheck(false)} disabled={analyzing || !message.trim()}>
                  Check on this device
                </Button>
              </div>
              {!authLoading && !user && (
                <p className="text-sm text-muted-foreground"><Link to="/auth" className="underline underline-offset-4">Sign in</Link> to also run an AI analysis.</p>
              )}
            </CardContent>
          </Card>

          <Card aria-live="polite">
            <CardHeader>
              <CardTitle>Analysis results</CardTitle>
              {result && (
                <CardDescription>
                  {result.source === "ai" ? "AI analysis and on-device checks" : requestedAi ? "AI unavailable. On-device checks completed." : "On-device checks"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={result.severity === "high" ? "destructive" : "secondary"}>
                      {result.isSuspicious ? (result.severity === "high" ? "High risk" : "Suspicious") : "Unverified"}
                    </Badge>
                    {result.isSuspicious && <span className="text-sm font-medium">{fraudCategoryLabel(result.category)}</span>}
                  </div>
                  {!result.signals.some(signal => signal.label === result.reason) && (
                    <p className="text-sm">{result.reason}</p>
                  )}
                  {result.signals.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold">Signals found</h2>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {result.signals.map(signal => <li key={signal.label}>{signal.label}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      What to do next
                    </h2>
                    <p>{fraudNextStep(result.category)}</p>
                    {result.isSuspicious && (
                      <p>
                        If you already sent money, contact your bank and call <a className="font-medium underline" href="tel:1930">1930</a> in India, or{" "}
                        <a className="inline-flex items-center gap-1 font-medium underline" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">
                          report online <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {analyzing ? "Checking the message…" : "Results will show the warning signs and how to verify the message safely."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
