import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Gift, BookOpen, Heart, Wheat, Building2, ExternalLink, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Scheme {
  id: string;
  name: string;
  ministry_department: string;
  category: string;
  state: string | null;
  description: string;
  eligibility_criteria: any;
  benefits: string;
  benefit_amount: string | null;
  application_process: string;
  official_link: string;
  documents_required: string[];
  application_deadline: string | null;
}

export function SchemeRecommendations() {
  const { user } = useAuth();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["scheme-recommendations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get user preferences
      const { data: preferences } = await supabase
        .from("user_scheme_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!preferences) return [];

      // Build query based on preferences
      let query = supabase
        .from("schemes")
        .select("*")
        .eq("is_active", true);

      // Filter by interested categories
      if (preferences.interested_categories && preferences.interested_categories.length > 0) {
        query = query.in("category", preferences.interested_categories);
      }

      // Filter by state (include both state-specific and central schemes)
      if (preferences.state) {
        query = query.or(`state.eq.${preferences.state},state.is.null`);
      }

      const { data: schemes, error } = await query.limit(20);
      if (error) throw error;

      // Score schemes based on user profile
      const scoredSchemes = schemes.map((scheme: Scheme) => {
        let score = 0;
        const criteria = scheme.eligibility_criteria || {};

        // Income level matching
        if (criteria.income_level && preferences.income_level) {
          if (criteria.income_level === preferences.income_level) score += 30;
          else if (criteria.income_level === "any" || preferences.income_level === "any") score += 15;
        }

        // Age matching
        if (criteria.age_min && criteria.age_max && preferences.age) {
          if (preferences.age >= criteria.age_min && preferences.age <= criteria.age_max) {
            score += 25;
          }
        }

        // Gender matching
        if (criteria.gender && preferences.gender) {
          if (criteria.gender === preferences.gender || criteria.gender === "any") score += 20;
        }

        // Occupation matching
        if (criteria.occupation && preferences.occupation) {
          if (criteria.occupation === preferences.occupation) score += 25;
        }

        // Location type matching
        if (criteria.location_type && preferences.location_type) {
          if (criteria.location_type === preferences.location_type) score += 15;
        }

        // Category preference boost
        if (preferences.interested_categories?.includes(scheme.category)) {
          score += 10;
        }

        return { ...scheme, score };
      });

      // Sort by score and return top recommendations
      return scoredSchemes
        .filter(scheme => scheme.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    },
    enabled: !!user,
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      finance: Gift,
      education: BookOpen,
      health: Heart,
      agriculture: Wheat,
      women: Users,
      employment: Building2,
    };
    const Icon = icons[category as keyof typeof icons] || Users;
    return <Icon className="h-4 w-4" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-orange-600";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <Star className="inline-block h-6 w-6 mr-2" />
          Personalized Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="space-y-4">
          <Star className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">No Recommendations Available</h3>
          <p className="text-muted-foreground">
            Please set your preferences to get personalized scheme recommendations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        <Star className="inline-block h-6 w-6 mr-2 text-yellow-500" />
        Personalized Recommendations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500 relative">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className={`${getScoreColor(scheme.score)} font-medium`}>
                {scheme.score}% match
              </Badge>
            </div>
            
            <CardHeader className="pb-3 pr-20">
              <div className="flex items-start gap-2">
                <CardTitle className="text-lg line-clamp-2">{scheme.name}</CardTitle>
                {getCategoryIcon(scheme.category)}
              </div>
              <CardDescription className="text-sm">
                {scheme.ministry_department}
                {scheme.state && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {scheme.state}
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {scheme.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Benefits:</span>
                  <Badge variant="outline" className="text-xs">
                    {scheme.category}
                  </Badge>
                </div>
                <p className="text-sm text-primary font-medium">
                  {scheme.benefit_amount || "Variable benefits"}
                </p>
              </div>

              {scheme.application_deadline && (
                <div className="text-sm">
                  <span className="font-medium">Deadline: </span>
                  <span className="text-destructive">
                    {formatDate(scheme.application_deadline)}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{scheme.name}</DialogTitle>
                      <DialogDescription>
                        {scheme.ministry_department}
                        {scheme.state && ` • ${scheme.state}`}
                        <Badge variant="secondary" className={`ml-2 ${getScoreColor(scheme.score)}`}>
                          {scheme.score}% match
                        </Badge>
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{scheme.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Benefits</h4>
                        <p className="text-sm">{scheme.benefits}</p>
                        {scheme.benefit_amount && (
                          <p className="text-sm font-medium text-primary mt-1">
                            Amount: {scheme.benefit_amount}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                        <div className="text-sm space-y-1">
                          {Object.entries(scheme.eligibility_criteria || {}).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Application Process</h4>
                        <p className="text-sm whitespace-pre-line">{scheme.application_process}</p>
                      </div>

                      {scheme.documents_required && scheme.documents_required.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Required Documents</h4>
                          <ul className="text-sm space-y-1">
                            {scheme.documents_required.map((doc, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button asChild className="w-full">
                        <a href={scheme.official_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button asChild size="sm" variant="default">
                  <a href={scheme.official_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}