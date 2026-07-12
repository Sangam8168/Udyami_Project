import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Shield, AlertTriangle, Trophy, Clock, Flame } from "lucide-react";

interface AdvancedFraudQuizProps {
  onComplete: (score: number) => void;
}

const AdvancedFraudQuiz = ({ onComplete }: AdvancedFraudQuizProps) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  const fraudMessagesByDifficulty = {
    beginner: [
      {
        id: 1,
        type: "SMS",
        message: "🎉 You won ₹10 Lakh! Send your bank details to claim prize. Call 9876543210",
        isGenuine: false,
        severity: "high",
        redFlags: ["Unsolicited prize", "Asking for bank details", "Unknown number"],
        explanation: "Classic lottery scam. You can't win a lottery you never entered. Never share bank details via SMS.",
        category: "Lottery Scam"
      },
      {
        id: 2,
        type: "Call",
        message: "Bank manager calling. Your KYC will expire today. Share your ATM PIN to update.",
        isGenuine: false,
        severity: "high",
        redFlags: ["Asking for PIN", "Creating urgency", "KYC expiry lie"],
        explanation: "Banks never ask for PIN/OTP. KYC doesn't expire suddenly. Always hang up and call bank official number.",
        category: "Banking Fraud"
      },
      {
        id: 3,
        type: "SMS",
        message: "Dear customer, your account debited ₹5,000. Transaction ID: ABC123. For issues, call 1800-000-000 (official bank number)",
        isGenuine: true,
        severity: "low",
        redFlags: [],
        explanation: "Standard transaction alert with official customer care number. Provides transaction ID for verification.",
        category: "Genuine Alert"
      },
      {
        id: 4,
        type: "WhatsApp",
        message: "Hi! I'm stuck in emergency. Can you UPI ₹5000 to this number? Will return tomorrow. - Your cousin",
        isGenuine: false,
        severity: "medium",
        redFlags: ["Impersonation", "Urgency", "New number", "Money request"],
        explanation: "Common impersonation scam. Always verify by calling the person on their known number first.",
        category: "Impersonation"
      }
    ],
    intermediate: [
      {
        id: 5,
        type: "Email",
        message: "From: income-tax@gov.in.verify.com\nSubject: Tax Refund ₹45,000\nClick here to claim your refund within 48 hours or it will be forfeited.",
        isGenuine: false,
        severity: "high",
        redFlags: ["Suspicious domain (.com not .gov.in)", "Urgency tactics", "Click bait"],
        explanation: "Fake domain mimicking government site. Real domain is incometax.gov.in. Tax refunds don't expire in 48 hours.",
        category: "Phishing Email"
      },
      {
        id: 6,
        type: "SMS",
        message: "Your Aadhaar card is locked due to misuse. Update details at aadhaar-update.com/verify to unlock.",
        isGenuine: false,
        severity: "high",
        redFlags: ["Fake Aadhaar lock claim", "Suspicious URL", "Fear tactics"],
        explanation: "UIDAI never locks Aadhaar. Official site is uidai.gov.in. This is phishing to steal personal data.",
        category: "Aadhaar Scam"
      },
      {
        id: 7,
        type: "WhatsApp",
        message: "Work from home opportunity! Earn ₹50,000/month. Just invest ₹10,000 for training materials. Guaranteed returns!",
        isGenuine: false,
        severity: "medium",
        redFlags: ["Too good to be true", "Upfront payment", "Guaranteed returns"],
        explanation: "Classic work-from-home scam. Legitimate jobs never ask for upfront payment. 'Guaranteed' returns are red flag.",
        category: "Job Scam"
      },
      {
        id: 8,
        type: "Call",
        message: "Telecom company calling. Your number will be disconnected due to non-KYC. Press 1 to connect to executive.",
        isGenuine: false,
        severity: "medium",
        redFlags: ["Automated threat call", "Disconnection threat", "Press button tactic"],
        explanation: "Telecom never threatens immediate disconnection via automated calls. They send official letters/SMS.",
        category: "Telecom Fraud"
      }
    ],
    advanced: [
      {
        id: 9,
        type: "Email",
        message: "From: noreply@paytm-secure.support.in\nYour wallet has suspicious activity. Verify your account: https://paytm.secure-verify.co.in\n(Login page looks exactly like Paytm)",
        isGenuine: false,
        severity: "high",
        redFlags: ["Look-alike domain", "Fake urgency", "Phishing link", "Similar but wrong URL"],
        explanation: "Sophisticated phishing with look-alike domain. Real Paytm is paytm.com (not paytm-secure.support.in). Always check URL carefully.",
        category: "Advanced Phishing"
      },
      {
        id: 10,
        type: "SMS",
        message: "Dear customer, suspicious login from Delhi detected on your bank account. If not you, call: 1800-111-109 (verified SBI number)",
        isGenuine: true,
        severity: "low",
        redFlags: [],
        explanation: "Legitimate security alert with official SBI customer care number. Banks do send such alerts. Verify by calling back on official number.",
        category: "Security Alert"
      },
      {
        id: 11,
        type: "WhatsApp",
        message: "Investment opportunity: Put ₹1 lakh in our company. We guarantee 40% returns in 6 months. RBI approved. Limited slots! - From number registered as 'Mutual Fund Advisor'",
        isGenuine: false,
        severity: "high",
        redFlags: ["Guaranteed high returns", "Pressure tactics", "False RBI claim", "WhatsApp investment"],
        explanation: "No legitimate investment guarantees 40% returns. RBI doesn't approve investment schemes. Real advisors use proper channels, not WhatsApp.",
        category: "Investment Fraud"
      },
      {
        id: 12,
        type: "Call",
        message: "Police officer calling. Your Aadhaar is linked to a money laundering case. Come to station immediately or we'll issue arrest warrant. Transfer ₹50,000 as security deposit.",
        isGenuine: false,
        severity: "high",
        redFlags: ["Impersonating police", "Money laundering fear", "Immediate money demand", "Phone arrest threat"],
        explanation: "Police never demand money over phone. No 'security deposit' for investigations. They use official procedures, not threatening calls.",
        category: "Police Impersonation"
      }
    ]
  };

  const messages = difficulty ? fraudMessagesByDifficulty[difficulty as keyof typeof fraudMessagesByDifficulty] : [];

  useEffect(() => {
    if (timeLeft > 0 && !showResult && difficulty) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, showResult, difficulty]);

  const handleDifficultySelect = (diff: string) => {
    setDifficulty(diff);
    setTimeLeft(diff === 'beginner' ? 40 : diff === 'intermediate' ? 35 : 30);
  };

  const handleTimeout = () => {
    setLives(lives - 1);
    setShowResult(true);
    setStreak(0);
    
    if (lives - 1 === 0) {
      setGameCompleted(true);
      const finalScore = Math.round((score / messages.length) * 100);
      onComplete(Math.max(finalScore, 10)); // Minimum 10% for participation
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentMsg = messages[currentQuestion];
    const correctAnswer = currentMsg.isGenuine ? "genuine" : "fraud";
    
    if (answer === correctAnswer) {
      const basePoints = 1;
      const speedBonus = timeLeft > 20 ? 0.5 : timeLeft > 10 ? 0.25 : 0;
      setScore(score + basePoints + speedBonus);
      setStreak(streak + 1);
    } else {
      setStreak(0);
      setLives(lives - 1);
      
      if (lives - 1 === 0) {
        setTimeout(() => {
          setGameCompleted(true);
          const finalScore = Math.round((score / messages.length) * 100);
          onComplete(Math.max(finalScore, 10));
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < messages.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(difficulty === 'beginner' ? 40 : difficulty === 'intermediate' ? 35 : 30);
    } else {
      setGameCompleted(true);
      const maxScore = messages.length * 1.5; // Base + bonuses
      const finalScore = Math.round((score / maxScore) * 100);
      onComplete(finalScore);
    }
  };

  if (!difficulty) {
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Choose Difficulty Level</CardTitle>
          <CardDescription>Test your fraud detection skills at different levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('beginner')}>
              <CardHeader>
                <div className="text-3xl mb-2">🛡️</div>
                <CardTitle className="text-lg">Beginner</CardTitle>
                <CardDescription>Common scams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Obvious red flags</p>
                <p className="text-sm text-muted-foreground">• 40s per message</p>
                <p className="text-sm text-muted-foreground">• 4 messages</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('intermediate')}>
              <CardHeader>
                <div className="text-3xl mb-2">🔍</div>
                <CardTitle className="text-lg">Intermediate</CardTitle>
                <CardDescription>Tricky scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Subtle deceptions</p>
                <p className="text-sm text-muted-foreground">• 35s per message</p>
                <p className="text-sm text-muted-foreground">• 4 messages</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('advanced')}>
              <CardHeader>
                <div className="text-3xl mb-2">🎯</div>
                <CardTitle className="text-lg">Advanced</CardTitle>
                <CardDescription>Expert detection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Sophisticated frauds</p>
                <p className="text-sm text-muted-foreground">• 30s per message</p>
                <p className="text-sm text-muted-foreground">• 4 messages</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    const maxScore = messages.length * 1.5;
    const finalScore = Math.round((score / maxScore) * 100);
    
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            {lives > 0 ? "Challenge Complete!" : "Challenge Ended"}
          </CardTitle>
          <CardDescription>
            {lives > 0 ? "बधाई हो! (Congratulations!)" : "बेहतर किस्मत अगली बार! (Better luck next time!)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-gradient-subtle rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{finalScore}%</div>
            <p className="text-muted-foreground">Fraud Detection Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              Difficulty: <Badge variant="outline">{difficulty}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              Longest Streak: <Badge variant="outline">{streak} 🔥</Badge>
            </p>
          </div>
          
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">Fraud Protection Mastery:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>✓ Never share OTP, PIN, passwords with anyone - not even "bank officials"</li>
              <li>✓ Verify caller/sender identity through official channels</li>
              <li>✓ Check URLs carefully for look-alike domains (paytm.com vs paytm-secure.in)</li>
              <li>✓ "Guaranteed returns" and "urgent action" are major red flags</li>
              <li>✓ Government/banks never threaten immediate action via call/SMS</li>
              <li>✓ When in doubt, hang up and call official numbers yourself</li>
            </ul>
          </div>

          <Alert className="mb-6 border-primary text-left">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Golden Rule:</strong> If something creates fear or urgency, it's likely a scam. Take time to verify independently.
            </AlertDescription>
          </Alert>

          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            {lives > 0 ? "Try Different Level" : "Try Again"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentMsg = messages[currentQuestion];
  const progress = ((currentQuestion + 1) / messages.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress and Stats Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Message {currentQuestion + 1} of {messages.length}
            </span>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Score: {score.toFixed(1)}</Badge>
              {streak > 0 && (
                <Badge className="bg-orange-500 flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>{streak}</span>
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center space-x-1">
                ❤️ <span>{lives}</span>
              </Badge>
              <Badge variant={timeLeft < 10 ? "destructive" : "outline"} className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeLeft}s</span>
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Message */}
      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground">
              Analyze This Message
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-accent">
                {currentMsg.type}
              </Badge>
              <Badge variant={currentMsg.severity === 'high' ? 'destructive' : currentMsg.severity === 'medium' ? 'default' : 'secondary'}>
                {currentMsg.category}
              </Badge>
            </div>
          </div>
          <CardDescription>
            Quick! Decide if this is genuine or fraudulent
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Message Display */}
          <div className="bg-accent/30 rounded-lg p-4 mb-6 border-l-4 border-primary">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                {currentMsg.type === 'SMS' && '📱'}
                {currentMsg.type === 'WhatsApp' && '💬'}
                {currentMsg.type === 'Email' && '📧'}
                {currentMsg.type === 'Call' && '📞'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {currentMsg.type} Message:
                </div>
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {currentMsg.message}
                </div>
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          {!showResult && (
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswerSelect("genuine")}
                variant="outline"
                className="h-auto p-4 hover:bg-success/10 hover:border-success"
              >
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="font-medium">Genuine</div>
                  <div className="text-sm text-muted-foreground">Safe to trust</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAnswerSelect("fraud")}
                variant="outline"
                className="h-auto p-4 hover:bg-destructive/10 hover:border-destructive"
              >
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <div className="font-medium">Fraudulent</div>
                  <div className="text-sm text-muted-foreground">This is a scam</div>
                </div>
              </Button>
            </div>
          )}

          {/* Result Display */}
          {showResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                (selectedAnswer === "genuine" && currentMsg.isGenuine) || 
                (selectedAnswer === "fraud" && !currentMsg.isGenuine)
                  ? 'bg-success/10 border-success' 
                  : 'bg-destructive/10 border-destructive'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {(selectedAnswer === "genuine" && currentMsg.isGenuine) || 
                   (selectedAnswer === "fraud" && !currentMsg.isGenuine) ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">Correct! {timeLeft > 20 ? "⚡ Speed Bonus!" : ""}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-destructive" />
                      <span className="font-medium text-destructive">Incorrect - Lost a life!</span>
                    </>
                  )}
                </div>
                <p className="text-sm">
                  This message is <strong>{currentMsg.isGenuine ? "GENUINE" : "FRAUDULENT"}</strong>
                </p>
              </div>

              <div className="bg-card rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Why:</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {currentMsg.explanation}
                </p>
                
                {!currentMsg.isGenuine && currentMsg.redFlags.length > 0 && (
                  <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                    <h5 className="font-medium text-destructive mb-2 text-sm flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Red Flags Spotted:</span>
                    </h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {currentMsg.redFlags.map((flag, index) => (
                        <li key={index}>🚩 {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {lives > 0 && (
                <Button 
                  onClick={handleNext}
                  className="w-full btn-primary"
                >
                  {currentQuestion < messages.length - 1 
                    ? 'अगला संदेश (Next Message)' 
                    : 'परिणाम देखें (See Results)'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFraudQuiz;
