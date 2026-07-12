import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Shield, AlertTriangle, Trophy } from "lucide-react";

interface FraudQuizProps {
  onComplete: (score: number) => void;
}

const FraudQuiz = ({ onComplete }: FraudQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const fraudMessages = [
    {
      id: 1,
      type: "SMS",
      message: "🎉 CONGRATULATIONS! You have won ₹5,00,000 in KBC lottery! Send your Aadhaar and bank details to claim. Call 9876543210 now!",
      isGenuine: false,
      redFlags: ["Unsolicited lottery win", "Asking for personal details", "Urgency pressure", "Unknown number"],
      explanation: "This is a classic lottery scam. Genuine lotteries never ask for personal details via SMS, and you can't win a lottery you never entered."
    },
    {
      id: 2,
      type: "WhatsApp",
      message: "Hi, this is your bank manager. Your account will be blocked today due to KYC issues. Please share your ATM PIN and OTP to update KYC immediately.",
      isGenuine: false,
      redFlags: ["Asking for PIN/OTP", "Creating urgency", "Impersonating bank", "Account blocking threat"],
      explanation: "Banks never ask for PIN, OTP, or passwords. They have your KYC details and would contact you through official channels, not WhatsApp."
    },
    {
      id: 3,
      type: "Email",
      message: "From: State Bank of India (sbi-alerts@sbi.co.in)\nDear Customer, Your account has been debited ₹25,000. If this transaction was not done by you, please call customer care at 1800-111-109.",
      isGenuine: true,
      redFlags: [],
      explanation: "This appears to be a genuine bank alert. The email ID looks official, there's no request for personal information, and the customer care number is the official SBI number."
    },
    {
      id: 4,
      type: "Call",
      message: "Caller: 'Madam, I am calling from income tax department. You have not paid tax on your savings account. Pay ₹15,000 penalty immediately or we will arrest you today.'",
      isGenuine: false,
      redFlags: ["Threatening arrest", "Immediate payment demand", "Cold call from tax department", "Fear tactics"],
      explanation: "Income tax department doesn't make threatening calls or demand immediate payments. They communicate through official letters and have proper procedures."
    },
    {
      id: 5,
      type: "SMS",
      message: "Your UPI transaction of ₹500 to Rajesh Mobile Store was successful. UPI Ref: 123456789. If not done by you, contact your bank.",
      isGenuine: true,
      redFlags: [],
      explanation: "This is a standard UPI transaction confirmation message. It provides transaction details and advises contacting the bank if unauthorized, which is appropriate."
    }
  ];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentMsg = fraudMessages[currentQuestion];
    const correctAnswer = currentMsg.isGenuine ? "genuine" : "fraud";
    
    if (answer === correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < fraudMessages.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      const finalScore = Math.round((score / fraudMessages.length) * 100);
      onComplete(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const finalScore = Math.round((score / fraudMessages.length) * 100);
    
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Fraud Detection Complete!</CardTitle>
          <CardDescription>बधाई हो! (Congratulations!)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-gradient-subtle rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{finalScore}%</div>
            <p className="text-muted-foreground">Your Fraud Detection Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              You correctly identified {score} out of {fraudMessages.length} messages
            </p>
          </div>
          
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">Fraud Protection Tips:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Never share OTP, PIN, or passwords with anyone</li>
              <li>• Banks never ask for sensitive information via SMS/call</li>
              <li>• Be suspicious of unsolicited lottery/prize messages</li>
              <li>• Verify caller identity through official bank numbers</li>
              <li>• Don't click links in suspicious messages</li>
              <li>• When in doubt, contact your bank directly</li>
            </ul>
          </div>

          <Alert className="mb-6 border-primary">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> If something sounds too good to be true or creates unnecessary urgency, it's likely a scam. Always verify through official channels.
            </AlertDescription>
          </Alert>

          <Button onClick={handleRestart} variant="outline" className="w-full">
            फिर से क्विज़ लें (Take Quiz Again)
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentMsg = fraudMessages[currentQuestion];
  const progress = ((currentQuestion + 1) / fraudMessages.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Message {currentQuestion + 1} of {fraudMessages.length}
            </span>
            <Badge variant="outline">Score: {score}/{fraudMessages.length}</Badge>
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
            <Badge variant="outline" className="bg-accent">
              {currentMsg.type}
            </Badge>
          </div>
          <CardDescription>
            Read the message carefully and decide if it's genuine or fraudulent
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
                  <div className="text-sm text-muted-foreground">This message is safe</div>
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
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    {(selectedAnswer === "genuine" && currentMsg.isGenuine) || 
                     (selectedAnswer === "fraud" && !currentMsg.isGenuine)
                      ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm">
                  This message is <strong>{currentMsg.isGenuine ? "GENUINE" : "FRAUDULENT"}</strong>
                </p>
              </div>

              <div className="bg-card rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Explanation:</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {currentMsg.explanation}
                </p>
                
                {!currentMsg.isGenuine && currentMsg.redFlags.length > 0 && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-sm">Red Flags:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {currentMsg.redFlags.map((flag, index) => (
                        <li key={index}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleNext}
                className="w-full btn-primary"
              >
                {currentQuestion < fraudMessages.length - 1 
                  ? 'अगला संदेश (Next Message)' 
                  : 'परिणाम देखें (See Results)'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudQuiz;