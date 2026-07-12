import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users, BookOpen } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            हमारे बारे में (About Us)
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            वित्त सखी is dedicated to empowering rural Indian women through financial literacy, 
            digital inclusion, and practical tools that make financial management accessible and understandable.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="shadow-warm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl text-foreground mb-4">
                हमारा मिशन (Our Mission)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                To bridge the financial literacy gap in rural India by providing women with 
                easy-to-use digital tools, personalized guidance, and culturally relevant 
                education that empowers them to make informed financial decisions and achieve 
                economic independence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            हमारे मूल्य (Our Values)
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-warm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  Empathy & Understanding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We understand the unique challenges faced by rural women and design 
                  our solutions with deep empathy and cultural sensitivity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-warm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  Accessible Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Financial education should be simple, practical, and available in 
                  local languages that everyone can understand and apply.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-warm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  Community First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in building strong communities where women support 
                  each other in their journey towards financial independence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <Card className="bg-gradient-subtle shadow-warm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-foreground mb-4">
                हमारा प्रभाव (Our Impact)
              </CardTitle>
              <CardDescription className="text-lg">
                Real stories from real women whose lives have been transformed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Digital Literacy Growth</h4>
                  <p className="text-muted-foreground mb-4">
                    "After using वित्त सखी, I learned to use UPI payments and now I can 
                    receive payments for my handicrafts directly on my phone."
                  </p>
                  <p className="text-sm text-primary font-medium">- Priya, Rajasthan</p>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Financial Independence</h4>
                  <p className="text-muted-foreground mb-4">
                    "The credit estimator helped me understand my loan eligibility, 
                    and I successfully got a loan to expand my small business."
                  </p>
                  <p className="text-sm text-primary font-medium">- Meera, Maharashtra</p>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Fraud Prevention</h4>
                  <p className="text-muted-foreground mb-4">
                    "The fraud detection tool saved me from a fake lottery scam. 
                    Now I check all suspicious messages before responding."
                  </p>
                  <p className="text-sm text-primary font-medium">- Sunita, Uttar Pradesh</p>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Savings Growth</h4>
                  <p className="text-muted-foreground mb-4">
                    "The savings games taught me how to budget properly. 
                    I've saved ₹50,000 in just one year!"
                  </p>
                  <p className="text-sm text-primary font-medium">- Kavita, Madhya Pradesh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            हमारी टीम (Our Team)
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our team consists of financial experts, technology specialists, and social workers 
            who are passionate about creating positive change in rural communities. We combine 
            deep understanding of rural contexts with cutting-edge technology to deliver 
            solutions that truly work for the women we serve.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;