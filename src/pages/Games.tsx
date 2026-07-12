import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Trophy, Star, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdvancedBudgetingGame from "@/components/games/AdvancedBudgetingGame";
import SavingsGoalGame from "@/components/games/SavingsGoalGame";
import AdvancedFraudQuiz from "@/components/games/AdvancedFraudQuiz";

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    budgeting: { completed: false, score: 0 },
    savings: { completed: false, score: 0 },
    fraud: { completed: false, score: 0 },
    digital: { completed: false, score: 0 }
  });
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadUserProgress();
  }, [user, navigate]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('game_id, score')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const progress = { ...userProgress };
      
      // Get best scores for each game
      data?.forEach((record) => {
        const gameId = record.game_id as keyof typeof progress;
        if (progress[gameId]) {
          progress[gameId] = {
            completed: true,
            score: Math.max(progress[gameId].score, record.score)
          };
        }
      });

      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const games = [
    {
      id: "budgeting",
      title: "उन्नत बजट चुनौती",
      titleEn: "Advanced Budgeting Challenge",
      description: "Master budgeting with 3 difficulty levels, timed challenges, and achievements",
      difficulty: "Beginner to Advanced",
      duration: "10-20 min", 
      points: 150,
      icon: "💰",
      component: AdvancedBudgetingGame
    },
    {
      id: "savings",
      title: "बचत लक्ष्य योजनाकार",
      titleEn: "Savings Goal Planner",
      description: "Create realistic savings plans for life goals with personalized recommendations",
      difficulty: "Beginner",
      duration: "8-12 min", 
      points: 150,
      icon: "🏦",
      component: SavingsGoalGame
    },
    {
      id: "fraud",
      title: "उन्नत धोखाधड़ी जांच",
      titleEn: "Advanced Fraud Detection",
      description: "Test your skills across 3 levels with real-world scam scenarios and time pressure",
      difficulty: "Beginner to Advanced",
      duration: "12-18 min",
      points: 200,
      icon: "🛡️",
      component: AdvancedFraudQuiz
    }
  ];

  const totalPoints = Object.values(userProgress).reduce((sum, progress) => sum + progress.score, 0);
  const completedGames = Object.values(userProgress).filter(progress => progress.completed).length;

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleGameComplete = async (gameId: string, score: number) => {
    if (!user || !session) return;

    try {
      // Save to database
      const { error } = await supabase.functions.invoke('save-game-score', {
        body: { gameId, score },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [gameId]: { 
          completed: true, 
          score: Math.max(prev[gameId as keyof typeof prev]?.score || 0, score)
        }
      }));
      
      toast({
        title: "स्कोर सहेजा गया! (Score Saved!)",
        description: `Your score of ${score}% has been saved.`,
      });
    } catch (error) {
      console.error('Error saving game score:', error);
      toast({
        title: "Error",
        description: "Failed to save score. Please try again.",
        variant: "destructive",
      });
    }

    setSelectedGame(null);
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game?.component;
    
    if (GameComponent) {
      return (
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                onClick={() => setSelectedGame(null)}
                variant="outline" 
                className="mb-4"
              >
                ← वापस जाएं (Go Back)
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">{game.titleEn}</h1>
              <p className="text-muted-foreground">{game.description}</p>
            </div>
            <GameComponent onComplete={(score: number) => handleGameComplete(selectedGame, score)} />
          </div>
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            वित्तीय शिक्षा खेल
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Learn financial concepts through fun, interactive games designed for you
          </p>
          
          {/* Progress Overview */}
          <div className="bg-gradient-subtle rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{totalPoints}</div>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{completedGames}/3</div>
                <p className="text-sm text-muted-foreground">Games Completed</p>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${completedGames > i ? 'text-primary fill-primary' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Achievement Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {games.map((game) => {
            const progress = userProgress[game.id as keyof typeof userProgress];
            const isAvailable = game.component !== null;
            
            return (
              <Card key={game.id} className={`shadow-warm transition-smooth ${isAvailable ? 'hover:shadow-glow cursor-pointer' : 'opacity-60'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{game.icon}</div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{game.titleEn}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {game.title}
                        </CardDescription>
                      </div>
                    </div>
                    {progress.completed && (
                      <Badge className="bg-success text-success-foreground">
                        <Trophy className="w-3 h-3 mr-1" />
                        {progress.score}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{game.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span>📊 {game.difficulty}</span>
                    <span>⏱️ {game.duration}</span>
                    <span>🎯 {game.points} points</span>
                  </div>

                  {progress.completed && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Your Best Score</span>
                        <span>{progress.score}%</span>
                      </div>
                      <Progress value={progress.score} className="h-2" />
                    </div>
                  )}

                  <Button 
                    onClick={() => handlePlayGame(game.id)}
                    disabled={!isAvailable}
                    className="w-full btn-primary"
                  >
                    {!isAvailable ? (
                      "जल्द आ रहा है (Coming Soon)"
                    ) : progress.completed ? (
                      <>फिर से खेलें (Play Again) <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                      <>खेल शुरू करें (Start Game) <Gamepad2 className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💡</span>
              <span>गेम टिप्स (Game Tips)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Choose difficulty level that matches your knowledge</li>
              <li>• Timed challenges test quick decision-making skills</li>
              <li>• Track your streak and earn achievements</li>
              <li>• Learn from detailed explanations after each question</li>
              <li>• Practice makes perfect - replay to improve scores!</li>
              <li>• Advanced levels include real-world complex scenarios</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Games;