import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calculator, IndianRupee, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const CreditEstimator = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    occupation: "",
    age: "",
    familySize: "",
    hasCollateral: false,
    existingLoans: "",
    savingsAmount: "",
    businessExperience: ""
  });
  
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [eligibleAmount, setEligibleAmount] = useState<number | null>(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const occupations = [
    { value: "farming", label: "कृषि (Farming)", score: 60 },
    { value: "tailoring", label: "सिलाई (Tailoring)", score: 70 },
    { value: "shop-owner", label: "दुकान मालिक (Shop Owner)", score: 75 },
    { value: "domestic-work", label: "घरेलू काम (Domestic Work)", score: 50 },
    { value: "handicrafts", label: "हस्तशिल्प (Handicrafts)", score: 65 },
    { value: "other", label: "अन्य (Other)", score: 55 }
  ];

  const calculateCreditScore = async () => {
    let score = 300; // Base score
    const income = parseInt(formData.monthlyIncome) || 0;
    const age = parseInt(formData.age) || 0;
    const familySize = parseInt(formData.familySize) || 0;
    const existingLoans = parseInt(formData.existingLoans) || 0;
    const savings = parseInt(formData.savingsAmount) || 0;
    const businessExp = parseInt(formData.businessExperience) || 0;

    // Income factor (0-150 points)
    if (income >= 15000) score += 150;
    else if (income >= 10000) score += 120;
    else if (income >= 7000) score += 90;
    else if (income >= 5000) score += 60;
    else score += 30;

    // Occupation factor (0-100 points)
    const occupation = occupations.find(occ => occ.value === formData.occupation);
    score += occupation?.score || 50;

    // Age factor (0-70 points)
    if (age >= 25 && age <= 45) score += 70;
    else if (age >= 18 && age <= 55) score += 50;
    else score += 30;

    // Family responsibility (0-50 points)
    if (familySize <= 3) score += 50;
    else if (familySize <= 5) score += 35;
    else score += 20;

    // Existing loans penalty
    if (existingLoans > income * 0.4) score -= 100;
    else if (existingLoans > income * 0.2) score -= 50;

    // Savings bonus (0-80 points)
    if (savings >= income * 3) score += 80;
    else if (savings >= income * 2) score += 60;
    else if (savings >= income) score += 40;
    else if (savings > 0) score += 20;

    // Business experience (0-60 points)
    if (businessExp >= 5) score += 60;
    else if (businessExp >= 3) score += 45;
    else if (businessExp >= 1) score += 30;
    else score += 10;

    // Collateral bonus
    if (formData.hasCollateral) score += 50;

    // Cap the score
    score = Math.min(score, 850);
    
    setCreditScore(score);
    calculateEligibleAmount(score, income);
    const recs = generateRecommendations(score, income);

    // Save to database
    if (user && session) {
      try {
        await supabase.functions.invoke('save-credit-assessment', {
          body: {
            monthlyIncome: income,
            monthlyExpenses: income * 0.6, // Estimated
            savings,
            existingLoans,
            creditScore: score,
            riskLevel: score >= 700 ? 'Low' : score >= 550 ? 'Medium' : 'High',
            recommendations: recs.join('; ')
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        toast({
          title: "Assessment Saved!",
          description: "Your credit assessment has been saved to your profile.",
        });
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
    }
  };

  const calculateEligibleAmount = (score: number, income: number) => {
    let multiplier = 1;
    
    if (score >= 750) multiplier = 8;
    else if (score >= 700) multiplier = 6;
    else if (score >= 650) multiplier = 4;
    else if (score >= 600) multiplier = 3;
    else if (score >= 550) multiplier = 2;
    else multiplier = 1;

    const amount = income * multiplier;
    setEligibleAmount(Math.min(amount, 500000)); // Cap at 5 lakh
  };

  const generateRecommendations = (score: number, income: number) => {
    const recs: string[] = [];

    if (score < 600) {
      recs.push("नियमित बचत करें और छोटे SHG लोन से शुरुआत करें");
      recs.push("अपनी आय बढ़ाने के तरीके खोजें");
    } else if (score < 700) {
      recs.push("बैंक से संपर्क करें - आप व्यक्तिगत लोन के लिए योग्य हैं");
      recs.push("अपने क्रेडिट स्कोर को बेहतर बनाने के लिए समय पर भुगतान करें");
    } else {
      recs.push("बधाई हो! आप बिजनेस लोन के लिए योग्य हैं");
      recs.push("कम ब्याज दर पर लोन मिल सकता है");
    }

    if (parseInt(formData.existingLoans) > income * 0.3) {
      recs.push("मौजूदा लोन कम करने की कोशिश करें");
    }

    setRecommendations(recs);
    return recs;
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-success";
    if (score >= 650) return "text-primary";
    if (score >= 550) return "text-accent-foreground";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return "उत्कृष्ट (Excellent)";
    if (score >= 650) return "अच्छा (Good)";
    if (score >= 550) return "औसत (Average)";
    return "सुधार की जरूरत (Needs Improvement)";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              क्रेडिट एस्टिमेटर (Credit Estimator)
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              अपनी वित्तीय जानकारी भरें और जानें कि आप कितने लोन के लिए योग्य हैं
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  वित्तीय विवरण (Financial Details)
                </CardTitle>
                <CardDescription>
                  कृपया अपनी सटीक जानकारी भरें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">मासिक आय (Monthly Income) ₹</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="15000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">पेशा (Occupation)</Label>
                  <Select 
                    value={formData.occupation} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="अपना पेशा चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occ) => (
                        <SelectItem key={occ.value} value={occ.value}>
                          {occ.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">उम्र (Age)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familySize">परिवार का आकार (Family Size)</Label>
                    <Input
                      id="familySize"
                      type="number"
                      placeholder="4"
                      value={formData.familySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, familySize: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingLoans">मौजूदा लोन (Existing Loans) ₹</Label>
                  <Input
                    id="existingLoans"
                    type="number"
                    placeholder="0"
                    value={formData.existingLoans}
                    onChange={(e) => setFormData(prev => ({ ...prev, existingLoans: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings">बचत राशि (Savings Amount) ₹</Label>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="25000"
                    value={formData.savingsAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, savingsAmount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessExp">व्यापारिक अनुभव (Business Experience) वर्ष</Label>
                  <Input
                    id="businessExp"
                    type="number"
                    placeholder="2"
                    value={formData.businessExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessExperience: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="collateral"
                    checked={formData.hasCollateral}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasCollateral: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="collateral">क्या आपके पास जमानत है? (Do you have collateral?)</Label>
                </div>

                <Button 
                  onClick={calculateCreditScore}
                  className="w-full transition-smooth"
                  disabled={!formData.monthlyIncome || !formData.occupation}
                >
                  क्रेडिट स्कोर गणना करें (Calculate Credit Score)
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {creditScore !== null && (
                <>
                  <Card className="shadow-warm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        आपका क्रेडिट स्कोर (Your Credit Score)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <div className={`text-4xl font-bold ${getScoreColor(creditScore)} mb-2`}>
                          {creditScore}
                        </div>
                        <Badge variant="outline" className="text-lg px-4 py-1">
                          {getScoreLabel(creditScore)}
                        </Badge>
                        <Progress value={(creditScore / 850) * 100} className="mt-4 h-3" />
                        <p className="text-sm text-muted-foreground mt-2">850 में से {creditScore}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {eligibleAmount !== null && (
                    <Card className="shadow-warm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IndianRupee className="w-5 h-5" />
                          योग्य लोन राशि (Eligible Loan Amount)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            ₹{eligibleAmount.toLocaleString('hi-IN')}
                          </div>
                          <p className="text-muted-foreground">
                            आप इस राशि तक का लोन ले सकते हैं
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-warm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        सुझाव (Recommendations)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreditEstimator;
