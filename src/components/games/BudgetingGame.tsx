import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface BudgetingGameProps {
  onComplete: (score: number) => void;
}

const BudgetingGame = ({ onComplete }: BudgetingGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Monthly Salary Planning",
      description: "Priya earns ₹15,000 per month. Her fixed expenses are: Rent ₹4,000, Food ₹3,000, Utilities ₹1,000. She wants to save for her daughter's education. How much should she save monthly?",
      options: [
        { text: "₹2,000 (13%)", amount: 2000, isCorrect: false },
        { text: "₹3,000 (20%)", amount: 3000, isCorrect: true },
        { text: "₹5,000 (33%)", amount: 5000, isCorrect: false },
        { text: "₹1,000 (7%)", amount: 1000, isCorrect: false }
      ],
      explanation: "After fixed expenses (₹8,000), Priya has ₹7,000 left. Saving ₹3,000 (20%) is a good balance between savings and emergency funds."
    },
    {
      id: 2,
      title: "Emergency Fund Priority",
      description: "Meera has ₹10,000 extra this month. She wants to buy gold jewelry (₹8,000) but also needs an emergency fund. What should she do?",
      options: [
        { text: "Buy the jewelry - gold is an investment", amount: 0, isCorrect: false },
        { text: "Save ₹6,000 for emergency, buy ₹4,000 jewelry", amount: 6000, isCorrect: true },
        { text: "Save all ₹10,000 for emergency fund", amount: 10000, isCorrect: false },
        { text: "Split equally - ₹5,000 each", amount: 5000, isCorrect: false }
      ],
      explanation: "Building an emergency fund should be the priority. A 60-40 split ensures financial security while allowing some personal spending."
    },
    {
      id: 3,
      title: "Festival Spending",
      description: "During Diwali, Sunita's family expects her to buy new clothes and gifts worth ₹8,000. Her monthly income is ₹12,000. How should she plan?",
      options: [
        { text: "Borrow money from friends/family", amount: 0, isCorrect: false },
        { text: "Start saving ₹1,500 monthly from 6 months before", amount: 1500, isCorrect: true },
        { text: "Skip the festival celebrations", amount: 0, isCorrect: false },
        { text: "Use credit card and pay later", amount: 0, isCorrect: false }
      ],
      explanation: "Planning ahead by saving small amounts monthly prevents debt and ensures you can enjoy festivals without financial stress."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (scenarios[currentScenario].options[answerIndex].isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      const finalScore = Math.round((score / scenarios.length) * 100);
      onComplete(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const finalScore = Math.round((score / scenarios.length) * 100);
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Game Complete!</CardTitle>
          <CardDescription>बधाई हो! (Congratulations!)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-gradient-subtle rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{finalScore}%</div>
            <p className="text-muted-foreground">Your Budgeting Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              You answered {score} out of {scenarios.length} scenarios correctly
            </p>
          </div>
          
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">What you learned:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Emergency funds should be prioritized over luxury spending</li>
              <li>• Saving 20% of income is a good target for financial health</li>
              <li>• Planning ahead prevents debt during special occasions</li>
              <li>• Budgeting helps balance needs, wants, and savings</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              फिर से खेलें (Play Again)
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
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <Badge variant="outline">Score: {score}/{scenarios.length}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Scenario */}
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">{currentScene.title}</CardTitle>
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

          {showResult && (
            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Explanation:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentScene.explanation}
              </p>
              
              <Button 
                onClick={handleNextScenario}
                className="mt-4"
              >
                {currentScenario < scenarios.length - 1 ? 'अगला प्रश्न (Next)' : 'परिणाम देखें (See Results)'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetingGame;