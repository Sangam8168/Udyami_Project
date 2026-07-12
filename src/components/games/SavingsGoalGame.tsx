import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calendar, Coins } from "lucide-react";

interface SavingsGoalGameProps {
  onComplete: (score: number) => void;
}

const SavingsGoalGame = ({ onComplete }: SavingsGoalGameProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInputs, setUserInputs] = useState({
    goal: "",
    amount: "",
    timeline: "",
    monthlyIncome: "",
    currentSavings: ""
  });
  const [gameData, setGameData] = useState({
    goalType: "",
    targetAmount: 0,
    timelineMonths: 0,
    monthlyRequired: 0,
    userMonthlySavings: 0,
    feasible: false
  });
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const savingsGoals = [
    { id: "education", name: "बच्चे की शिक्षा (Child's Education)", amount: 100000, icon: "🎓" },
    { id: "house", name: "घर का डाउन पेमेंट (House Down Payment)", amount: 200000, icon: "🏠" },
    { id: "wedding", name: "शादी की तैयारी (Wedding Preparation)", amount: 150000, icon: "💒" },
    { id: "emergency", name: "आपातकालीन फंड (Emergency Fund)", amount: 50000, icon: "🆘" },
    { id: "business", name: "व्यापार शुरू करना (Start Business)", amount: 75000, icon: "💼" }
  ];

  const handleGoalSelect = (goal: any) => {
    setUserInputs({
      ...userInputs,
      goal: goal.name,
      amount: goal.amount.toString()
    });
    setGameData({
      ...gameData,
      goalType: goal.name,
      targetAmount: goal.amount
    });
    setCurrentStep(1);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInputs({
      ...userInputs,
      [field]: value
    });
  };

  const calculateSavings = () => {
    const monthlyIncome = parseInt(userInputs.monthlyIncome) || 0;
    const timeline = parseInt(userInputs.timeline) || 1;
    const targetAmount = parseInt(userInputs.amount) || 0;
    const currentSavings = parseInt(userInputs.currentSavings) || 0;
    
    const remainingAmount = targetAmount - currentSavings;
    const monthlyRequired = remainingAmount / timeline;
    const maxSavingsCapacity = monthlyIncome * 0.3; // Assume 30% is max sustainable savings rate
    
    const feasible = monthlyRequired <= maxSavingsCapacity && monthlyRequired > 0;
    
    setGameData({
      ...gameData,
      timelineMonths: timeline,
      monthlyRequired: monthlyRequired,
      userMonthlySavings: monthlyRequired,
      feasible: feasible
    });

    // Calculate score based on feasibility and planning
    let calculatedScore = 0;
    if (feasible) calculatedScore += 40;
    if (timeline >= 12) calculatedScore += 20; // Realistic timeline
    if (monthlyRequired <= monthlyIncome * 0.25) calculatedScore += 30; // Conservative savings rate
    if (currentSavings > 0) calculatedScore += 10; // Already has some savings
    
    setScore(calculatedScore);
    setCurrentStep(2);
  };

  const completeGame = () => {
    setGameCompleted(true);
    onComplete(score);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserInputs({
      goal: "",
      amount: "",
      timeline: "",
      monthlyIncome: "",
      currentSavings: ""
    });
    setGameData({
      goalType: "",
      targetAmount: 0,
      timelineMonths: 0,
      monthlyRequired: 0,
      userMonthlySavings: 0,
      feasible: false
    });
    setScore(0);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    return (
      <Card className="max-w-4xl mx-auto shadow-warm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Savings Plan Complete!</CardTitle>
          <CardDescription>बधाई हो! (Congratulations!)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-gradient-subtle rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
            <p className="text-muted-foreground">Your Savings Planning Score</p>
          </div>
          
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">Your Savings Plan Summary:</h4>
            <div className="bg-card rounded-lg p-4 space-y-2">
              <p><strong>Goal:</strong> {gameData.goalType}</p>
              <p><strong>Target Amount:</strong> ₹{gameData.targetAmount.toLocaleString()}</p>
              <p><strong>Timeline:</strong> {gameData.timelineMonths} months</p>
              <p><strong>Monthly Savings Needed:</strong> ₹{Math.round(gameData.monthlyRequired).toLocaleString()}</p>
              <p className={`font-semibold ${gameData.feasible ? 'text-success' : 'text-destructive'}`}>
                <strong>Status:</strong> {gameData.feasible ? "✅ Achievable" : "⚠️ Needs Adjustment"}
              </p>
            </div>
          </div>

          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-foreground">Key Learnings:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Break large financial goals into smaller monthly targets</li>
              <li>• Save 20-30% of income for long-term goals</li>
              <li>• Having some existing savings makes goals more achievable</li>
              <li>• Realistic timelines prevent financial stress</li>
              <li>• Regular savings habits build financial discipline</li>
            </ul>
          </div>

          <Button onClick={handleRestart} variant="outline" className="w-full">
            नया लक्ष्य बनाएं (Create New Goal)
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentStep + 1) / 3) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of 3
            </span>
            <Badge variant="outline">Planning Your Savings Goal</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step 0: Goal Selection */}
      {currentStep === 0 && (
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Choose Your Savings Goal</span>
            </CardTitle>
            <CardDescription>
              Select what you want to save for, or create a custom goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {savingsGoals.map((goal) => (
                <Button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal)}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start hover:bg-accent/50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <div className="font-medium">{goal.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Suggested: ₹{goal.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Or create a custom goal:</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="customGoal">Goal Name</Label>
                  <Input
                    id="customGoal"
                    placeholder="e.g., नई मोटरसाइकिल (New Motorcycle)"
                    value={userInputs.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customAmount">Target Amount (₹)</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="e.g., 80000"
                    value={userInputs.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (userInputs.goal && userInputs.amount) {
                      setGameData({
                        ...gameData,
                        goalType: userInputs.goal,
                        targetAmount: parseInt(userInputs.amount)
                      });
                      setCurrentStep(1);
                    }
                  }}
                  disabled={!userInputs.goal || !userInputs.amount}
                  className="w-full btn-primary"
                >
                  Continue with Custom Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Timeline and Income Input */}
      {currentStep === 1 && (
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Plan Your Timeline</span>
            </CardTitle>
            <CardDescription>
              Tell us about your income and when you want to achieve this goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/30 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-foreground">Your Goal: {gameData.goalType}</h4>
              <p className="text-muted-foreground">Target Amount: ₹{gameData.targetAmount.toLocaleString()}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="e.g., 15000"
                  value={userInputs.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Timeline (months)</Label>
                <Input
                  id="timeline"
                  type="number"
                  placeholder="e.g., 24"
                  value={userInputs.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currentSavings">Current Savings (₹)</Label>
              <Input
                id="currentSavings"
                type="number"
                placeholder="e.g., 5000"
                value={userInputs.currentSavings}
                onChange={(e) => handleInputChange("currentSavings", e.target.value)}
              />
            </div>

            <Button 
              onClick={calculateSavings}
              disabled={!userInputs.monthlyIncome || !userInputs.timeline}
              className="w-full btn-primary"
            >
              Calculate Savings Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Results and Recommendations */}
      {currentStep === 2 && (
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="w-6 h-6" />
              <span>Your Savings Plan</span>
            </CardTitle>
            <CardDescription>
              Here's your personalized savings strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`rounded-lg p-6 mb-6 ${gameData.feasible ? 'bg-success/10 border border-success' : 'bg-destructive/10 border border-destructive'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Monthly Savings Required</h3>
                <Badge className={gameData.feasible ? 'bg-success' : 'bg-destructive'}>
                  {gameData.feasible ? 'Achievable' : 'Challenging'}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">₹{Math.round(gameData.monthlyRequired).toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">
                {Math.round((gameData.monthlyRequired / parseInt(userInputs.monthlyIncome)) * 100)}% of your monthly income
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-medium">Recommendations:</h4>
              {gameData.feasible ? (
                <div className="space-y-2 text-sm">
                  <p className="text-success">✅ Your goal is achievable with disciplined saving!</p>
                  <p>• Set up automatic savings on payday</p>
                  <p>• Track your progress monthly</p>
                  <p>• Consider a dedicated savings account</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-destructive">⚠️ This goal needs adjustment:</p>
                  <p>• Consider extending your timeline</p>
                  <p>• Look for ways to increase income</p>
                  <p>• Reduce the target amount if possible</p>
                  <p>• Start with a smaller emergency fund first</p>
                </div>
              )}
            </div>

            <Button 
              onClick={completeGame}
              className="w-full btn-primary"
            >
              Complete Savings Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoalGame;