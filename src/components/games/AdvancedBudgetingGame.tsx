import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, Clock, Zap, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedBudgetingGameProps {
  onComplete: (score: number) => void;
}

const AdvancedBudgetingGame = ({ onComplete }: AdvancedBudgetingGameProps) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const scenariosByDifficulty = {
    beginner: [
      {
        id: 1,
        title: "Basic Monthly Budget",
        description: "Priya earns ₹15,000/month. Rent: ₹4,000, Food: ₹3,000, Utilities: ₹1,000. How much can she save for emergencies?",
        options: [
          { text: "₹7,000 (47%)", isCorrect: true, explanation: "Correct! After all expenses, ₹7,000 remains for savings and other needs." },
          { text: "₹5,000 (33%)", isCorrect: false, explanation: "This leaves ₹2,000 unaccounted for." },
          { text: "₹3,000 (20%)", isCorrect: false, explanation: "This is too conservative - more can be saved." },
          { text: "₹1,000 (7%)", isCorrect: false, explanation: "This leaves most income unused." }
        ],
        tips: "Always calculate total expenses first, then see what's left.",
        timeLimit: 45
      },
      {
        id: 2,
        title: "Emergency vs Wants",
        description: "Meera has ₹8,000 extra. She wants new clothes (₹6,000) but has no emergency fund. What should she prioritize?",
        options: [
          { text: "Buy clothes - she needs them", isCorrect: false, explanation: "Wants should come after building emergency security." },
          { text: "Save ₹6,000 emergency, ₹2,000 clothes", isCorrect: true, explanation: "Perfect! Priority to emergency fund while allowing some personal spending." },
          { text: "Save all ₹8,000", isCorrect: false, explanation: "While safe, a small allowance for wants maintains balance." },
          { text: "Buy clothes now, save next month", isCorrect: false, explanation: "Delaying emergency fund is risky." }
        ],
        tips: "Emergency funds protect against unexpected expenses.",
        timeLimit: 45
      },
      {
        id: 3,
        title: "Festival Planning",
        description: "Sunita needs ₹12,000 for Diwali in 6 months. Her income is ₹18,000/month. How much should she save monthly?",
        options: [
          { text: "₹1,000/month", isCorrect: false, explanation: "This only gives ₹6,000 - half of what's needed." },
          { text: "₹2,000/month", isCorrect: true, explanation: "Perfect! ₹2,000 x 6 = ₹12,000, and it's only 11% of income." },
          { text: "₹3,000/month", isCorrect: false, explanation: "This overshoots the target and may strain the budget." },
          { text: "₹500/month", isCorrect: false, explanation: "This will only give ₹3,000 - far too little." }
        ],
        tips: "Divide target amount by number of months for monthly savings.",
        timeLimit: 45
      }
    ],
    intermediate: [
      {
        id: 4,
        title: "Income Fluctuation Planning",
        description: "Anjali's tailoring business earns ₹20,000 some months and ₹8,000 others. Average: ₹14,000. Her expenses are ₹10,000. How should she budget?",
        options: [
          { text: "Spend based on each month's income", isCorrect: false, explanation: "This creates instability in lean months." },
          { text: "Budget ₹10,000 expenses, save excess in good months", isCorrect: true, explanation: "Smart! This ensures stability and builds reserves for lean months." },
          { text: "Reduce expenses to ₹8,000 to be safe", isCorrect: false, explanation: "Too conservative given the average income." },
          { text: "Take loan in lean months", isCorrect: false, explanation: "Loans cost interest and should be avoided if possible." }
        ],
        tips: "Variable income requires buffer savings for lean periods.",
        timeLimit: 40
      },
      {
        id: 5,
        title: "Loan vs Savings Decision",
        description: "Radha needs ₹50,000 for equipment. She has ₹30,000 saved. Bank loan: 12% interest. Should she take a ₹20,000 loan?",
        options: [
          { text: "Yes - keep savings for emergencies", isCorrect: true, explanation: "Correct! Maintaining emergency fund is crucial. ₹20,000 loan at 12% for 1 year = ₹2,400 interest, worth the security." },
          { text: "No - use all savings to avoid interest", isCorrect: false, explanation: "This leaves no emergency buffer - risky!" },
          { text: "Wait and save the full amount", isCorrect: false, explanation: "Delaying business opportunity has its own cost." },
          { text: "Take ₹50,000 loan, keep all savings", isCorrect: false, explanation: "Unnecessarily high interest when you have savings." }
        ],
        tips: "Balance between using savings and maintaining emergency funds.",
        timeLimit: 50
      },
      {
        id: 6,
        title: "Multiple Goals Prioritization",
        description: "Kavita has ₹5,000 monthly surplus. Goals: Child education (₹200k), house (₹500k), retirement (₹1M). All are 10 years away. How to allocate?",
        options: [
          { text: "Focus all ₹5,000 on education first", isCorrect: false, explanation: "Putting all eggs in one basket delays other important goals." },
          { text: "Split equally: ₹1,666 each to 3 goals", isCorrect: false, explanation: "Equal split ignores differing priorities and amounts." },
          { text: "₹2,500 education, ₹1,500 house, ₹1,000 retirement", isCorrect: true, explanation: "Smart prioritization! Most urgent (education) gets highest allocation while others progress too." },
          { text: "₹5,000 rotating between goals each month", isCorrect: false, explanation: "Inefficient - loses compound benefits and creates tracking complexity." }
        ],
        tips: "Prioritize based on timeline and importance, but don't neglect any major goal.",
        timeLimit: 60
      }
    ],
    advanced: [
      {
        id: 7,
        title: "Inflation-Adjusted Planning",
        description: "Education costs ₹100k today, growing 8% yearly. You need it in 5 years. With 10% annual returns, how much to invest monthly?",
        options: [
          { text: "₹1,667/month (₹100k ÷ 60 months)", isCorrect: false, explanation: "This ignores inflation! Future cost will be ~₹147k." },
          { text: "₹2,000/month", isCorrect: false, explanation: "Close, but doesn't account for investment returns." },
          { text: "₹1,900/month", isCorrect: true, explanation: "Correct! Accounts for both 8% inflation (future value ₹147k) and 10% returns on monthly investments." },
          { text: "₹2,500/month to be safe", isCorrect: false, explanation: "Overly conservative - wastes money that could go to other goals." }
        ],
        tips: "Consider inflation and investment returns for long-term goals.",
        timeLimit: 70
      },
      {
        id: 8,
        title: "Tax-Efficient Savings",
        description: "Income ₹6L/year (30% tax bracket). Invest ₹1.5L in 80C (saves tax). PPF gives 7.1% tax-free. FD gives 6.5% taxable. Best option for ₹1.5L?",
        options: [
          { text: "FD - higher liquidity", isCorrect: false, explanation: "FD gives 6.5%, but after 30% tax = 4.55% effective return." },
          { text: "PPF - tax benefits on investment + returns", isCorrect: true, explanation: "Brilliant! PPF: saves ₹45k tax (30% of 1.5L) + 7.1% tax-free returns = effective ~10% return!" },
          { text: "Split between both equally", isCorrect: false, explanation: "Why dilute the superior tax-advantaged option?" },
          { text: "Keep in savings account for emergencies", isCorrect: false, explanation: "Emergency fund is separate - this is investment money." }
        ],
        tips: "Tax-saving instruments can significantly boost effective returns.",
        timeLimit: 60
      },
      {
        id: 9,
        title: "Business Cash Flow Management",
        description: "Your business: ₹80k monthly revenue, ₹50k expenses. Customers pay 30 days late. Suppliers want immediate payment. What's your strategy?",
        options: [
          { text: "Take monthly loan to cover cash gap", isCorrect: false, explanation: "Constant borrowing creates expensive interest burden." },
          { text: "Build ₹50k working capital buffer first", isCorrect: true, explanation: "Perfect! This buffer covers the payment lag, breaking the loan cycle." },
          { text: "Ask suppliers to wait 30 days too", isCorrect: false, explanation: "May damage supplier relationships and creditworthiness." },
          { text: "Reduce expenses to match cash flow", isCorrect: false, explanation: "Addresses symptom, not cause. May hurt business growth." }
        ],
        tips: "Working capital management is crucial for businesses with payment delays.",
        timeLimit: 55
      }
    ]
  };

  const scenarios = difficulty ? scenariosByDifficulty[difficulty as keyof typeof scenariosByDifficulty] : [];

  // Timer effect
  useState(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleAnswerSelect(-1); // Time's up - wrong answer
    }
  });

  const handleDifficultySelect = (diff: string) => {
    setDifficulty(diff);
    setTimerActive(true);
    const firstScenario = scenariosByDifficulty[diff as keyof typeof scenariosByDifficulty][0];
    setTimeLeft(firstScenario.timeLimit);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTimerActive(false);

    const isCorrect = answerIndex >= 0 && scenarios[currentScenario].options[answerIndex].isCorrect;
    
    if (isCorrect) {
      const baseScore = 1;
      const timeBonus = timeLeft > 10 ? 0.5 : 0; // Bonus for quick answers
      setScore(score + baseScore + timeBonus);
      setStreak(streak + 1);
      
      // Check for achievements
      if (streak + 1 === 3) {
        setAchievements([...achievements, "🔥 Hot Streak!"]);
      }
      if (timeBonus > 0) {
        setAchievements([...achievements, "⚡ Speed Demon!"]);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimerActive(true);
      setTimeLeft(scenarios[currentScenario + 1].timeLimit);
    } else {
      setGameCompleted(true);
      const maxPossibleScore = scenarios.length * 1.5; // Base + time bonuses
      const finalScore = Math.round((score / maxPossibleScore) * 100);
      onComplete(finalScore);
    }
  };

  if (!difficulty) {
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Choose Your Challenge Level</CardTitle>
          <CardDescription>Select difficulty to begin your budgeting journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('beginner')}>
              <CardHeader>
                <div className="text-3xl mb-2">🌱</div>
                <CardTitle className="text-lg">Beginner</CardTitle>
                <CardDescription>Basic budgeting concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Simple scenarios</p>
                <p className="text-sm text-muted-foreground">• 45s per question</p>
                <p className="text-sm text-muted-foreground">• 3 scenarios</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('intermediate')}>
              <CardHeader>
                <div className="text-3xl mb-2">🎯</div>
                <CardTitle className="text-lg">Intermediate</CardTitle>
                <CardDescription>Real-world challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Variable income</p>
                <p className="text-sm text-muted-foreground">• 40-60s per question</p>
                <p className="text-sm text-muted-foreground">• 3 scenarios</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-smooth border-2 hover:border-primary" onClick={() => handleDifficultySelect('advanced')}>
              <CardHeader>
                <div className="text-3xl mb-2">🏆</div>
                <CardTitle className="text-lg">Advanced</CardTitle>
                <CardDescription>Expert financial planning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">• Inflation & taxes</p>
                <p className="text-sm text-muted-foreground">• 55-70s per question</p>
                <p className="text-sm text-muted-foreground">• 3 scenarios</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    const maxPossibleScore = scenarios.length * 1.5;
    const finalScore = Math.round((score / maxPossibleScore) * 100);
    
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Challenge Complete!</CardTitle>
          <CardDescription>बधाई हो! (Congratulations!)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-gradient-subtle rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{finalScore}%</div>
            <p className="text-muted-foreground">Your Budgeting Mastery Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              Difficulty: <Badge variant="outline">{difficulty}</Badge>
            </p>
          </div>

          {achievements.length > 0 && (
            <div className="mb-6 p-4 bg-accent/30 rounded-lg">
              <h4 className="font-semibold mb-2">Achievements Unlocked!</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map((achievement, idx) => (
                  <Badge key={idx} className="text-sm">{achievement}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">What you mastered:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              {difficulty === 'beginner' && (
                <>
                  <li>• Basic expense calculation and savings planning</li>
                  <li>• Emergency fund prioritization</li>
                  <li>• Planning for future expenses</li>
                </>
              )}
              {difficulty === 'intermediate' && (
                <>
                  <li>• Managing variable income streams</li>
                  <li>• Balancing loans vs savings decisions</li>
                  <li>• Multi-goal financial planning</li>
                </>
              )}
              {difficulty === 'advanced' && (
                <>
                  <li>• Inflation-adjusted goal planning</li>
                  <li>• Tax-efficient investment strategies</li>
                  <li>• Business cash flow management</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex space-x-4">
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              Try Different Level
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentScene = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress and Stats Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Score: {score.toFixed(1)}</span>
              </Badge>
              {streak > 0 && (
                <Badge className="bg-orange-500 flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>{streak} Streak</span>
                </Badge>
              )}
              <Badge variant={timeLeft < 10 ? "destructive" : "outline"} className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeLeft}s</span>
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Scenario */}
      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground">{currentScene.title}</CardTitle>
            <Badge>{difficulty}</Badge>
          </div>
          <CardDescription className="text-base leading-relaxed">
            {currentScene.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {currentScene.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                variant="outline"
                className={`w-full text-left justify-start h-auto p-4 ${
                  selectedAnswer === index 
                    ? option.isCorrect 
                      ? 'border-success bg-success/10' 
                      : 'border-destructive bg-destructive/10'
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option.text}</span>
                  {showResult && selectedAnswer === index && (
                    option.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )
                  )}
                </div>
              </Button>
            ))}
          </div>

          {showResult && selectedAnswer !== null && selectedAnswer >= 0 && (
            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Explanation:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {currentScene.options[selectedAnswer].explanation}
              </p>
              
              <div className="bg-card rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>💡 Tip:</strong> {currentScene.tips}
                </p>
              </div>
              
              <Button 
                onClick={handleNextScenario}
                className="w-full"
              >
                {currentScenario < scenarios.length - 1 ? 'अगला प्रश्न (Next)' : 'परिणाम देखें (See Results)'}
              </Button>
            </div>
          )}

          {showResult && selectedAnswer === -1 && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive">
              <p className="text-destructive font-semibold mb-2">⏰ Time's Up!</p>
              <p className="text-sm text-muted-foreground mb-4">The correct answer was: {currentScene.options.find(o => o.isCorrect)?.text}</p>
              <Button onClick={handleNextScenario} className="w-full">
                {currentScenario < scenarios.length - 1 ? 'Continue' : 'See Results'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedBudgetingGame;
