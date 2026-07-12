import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FeatureCard from "@/components/FeatureCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calculator, Gamepad2, Shield, Gift } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  const features = [
    {
      id: "schemes",
      title: "सरकारी योजनाएं",
      titleEn: "Government Schemes",
      description: "Discover financial assistance, subsidies, and benefits from Government of India schemes tailored for you.",
      icon: Gift,
    },
    {
      id: "credit",
      title: "क्रेडिट मूल्यांकन",
      titleEn: "Credit Estimator",
      description: "Check your creditworthiness based on your income, expenses, and savings. Understand your loan eligibility.",
      icon: Calculator,
    },
    {
      id: "games",
      title: "वित्तीय शिक्षा खेल",
      titleEn: "Financial Learning Games",
      description: "Learn budgeting, saving, and fraud prevention through fun, interactive games designed for you.",
      icon: Gamepad2,
    },
    {
      id: "fraud",
      title: "धोखाधड़ी संदेश जांच",
      titleEn: "Fraud Message Detection",
      description: "Check if a message you received is fraudulent or safe. Protect yourself from financial scams.",
      icon: Shield,
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="relative overflow-hidden rounded-2xl shadow-warm">
            <img 
              src={heroImage} 
              alt="Rural women using digital financial services"
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="max-w-4xl px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Udyami - आपकी वित्तीय साथी
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  Financial empowerment for rural women through digital literacy, 
                  smart tools, and personalized guidance. Join thousands of women taking control of their financial future.
                </p>
                <Button 
                  onClick={() => setSelectedFeature("schemes")}
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg transition-smooth"
                >
                  अभी शुरू करें (Start Now)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              आपके लिए वित्तीय उपकरण
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover tools designed specifically for rural women to learn, grow, and protect their financial well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.titleEn}
                description={feature.description}
                icon={feature.icon}
                onClick={() => handleFeatureClick(feature.id)}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Selected Feature Display */}
        {selectedFeature && (
          <Card className="max-w-4xl mx-auto shadow-warm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                {features.find(f => f.id === selectedFeature)?.title}
              </CardTitle>
              <CardDescription className="text-base">
                {features.find(f => f.id === selectedFeature)?.titleEn}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {selectedFeature === "schemes" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Explore government schemes and get personalized recommendations based on your profile and needs.
                  </p>
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-3">Available Features:</h4>
                    <ul className="text-left space-y-2 text-muted-foreground">
                      <li>• Browse all government schemes</li>
                      <li>• Get personalized recommendations</li>
                      <li>• Filter by category and eligibility</li>
                      <li>• Set preferences for notifications</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/schemes')}
                    className="mt-4"
                  >
                    योजनाएं देखें (View Schemes)
                  </Button>
                </div>
              )}

              {selectedFeature === "credit" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Estimate your creditworthiness with our simple form. Get instant results in easy-to-understand language.
                  </p>
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-3">We'll Ask About:</h4>
                    <ul className="text-left space-y-2 text-muted-foreground">
                      <li>• Your monthly income</li>
                      <li>• Monthly expenses</li>
                      <li>• Current savings</li>
                      <li>• Any existing loans</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/credit-estimator')}
                    className="mt-4"
                  >
                    मूल्यांकन शुरू करें (Start Assessment)
                  </Button>
                </div>
              )}

              {selectedFeature === "games" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Learn through fun, interactive games designed to teach financial concepts in an engaging way.
                  </p>
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-3">Available Games:</h4>
                    <ul className="text-left space-y-2 text-muted-foreground">
                      <li>• Budgeting Challenge</li>
                      <li>• Savings Goals Game</li>
                      <li>• Fraud Prevention Quiz</li>
                      <li>• Digital Payment Simulator</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/games')}
                    className="mt-4"
                  >
                    खेल शुरू करें (Start Playing)
                  </Button>
                </div>
              )}

              {selectedFeature === "fraud" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Paste any suspicious message you've received and our AI will analyze it for potential fraud.
                  </p>
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-3">We Check For:</h4>
                    <ul className="text-left space-y-2 text-muted-foreground">
                      <li>• Fake lottery/prize messages</li>
                      <li>• Suspicious payment requests</li>
                      <li>• Phishing attempts</li>
                      <li>• Fraudulent bank notifications</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => navigate('/fraud-detection')}
                    className="mt-4"
                  >
                    संदेश जांचें (Check Message)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics Section */}
        <div className="mt-16 bg-gradient-subtle rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              हमारा प्रभाव (Our Impact)
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-muted-foreground">Women Empowered</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Villages Reached</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Success Rate in Financial Goals</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
