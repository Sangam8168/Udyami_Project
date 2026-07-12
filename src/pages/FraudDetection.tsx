import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Scan, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FraudDetectionResult {
  isSuspicious: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  category: string;
}

const FraudDetection = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudDetectionResult | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ml-fraud-detection', {
        body: { message, language: 'english' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      setResult(data);
    } catch (error) {
      console.error('Fraud detection error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Shield className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">AI Fraud Detection</h1>
            </div>
            <p className="text-muted-foreground">
              Use our advanced ML-powered system to analyze messages for potential fraud, scams, and suspicious content.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  Message Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message to Analyze
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Enter the message you want to analyze for fraud detection..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={analyzeMessage} 
                  disabled={loading || !message.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Scan className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSeverityIcon(result.severity)}
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        {result.isSuspicious ? (
                          <Badge variant="destructive">Suspicious</Badge>
                        ) : (
                          <Badge variant="secondary">Clean</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Severity:</span>
                        <Badge variant={getSeverityColor(result.severity)}>
                          {result.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Confidence:</span>
                        <span className="text-sm">{result.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm capitalize">{result.category}</span>
                      </div>
                    </div>
                  </div>

                  <Alert className={result.isSuspicious ? "border-destructive" : "border-green-500"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Analysis:</strong> {result.reason}
                    </AlertDescription>
                  </Alert>

                  {result.isSuspicious && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> This message contains patterns commonly associated with fraud or scams. 
                        Please exercise caution and do not share personal information, OTP codes, or make financial transactions 
                        based on this message.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Scan className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Our ML model analyzes message patterns for fraud indicators
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides confidence scores and severity levels
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Helps you stay safe from phishing and scams
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FraudDetection;