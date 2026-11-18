import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSchemes } from "@/lib/schemes";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Users, Gift, BookOpen, Heart, Wheat, Building2, ExternalLink } from "lucide-react";
import { SchemePreferencesForm } from "@/components/schemes/SchemePreferencesForm";
import { SchemeRecommendations } from "@/components/schemes/SchemeRecommendations";

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: Users },
  { value: "finance", label: "Finance", icon: Gift },
  { value: "education", label: "Education", icon: BookOpen },
  { value: "health", label: "Health", icon: Heart },
  { value: "agriculture", label: "Agriculture", icon: Wheat },
  { value: "women", label: "Women Empowerment", icon: Users },
  { value: "employment", label: "Employment", icon: Building2 },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const { data: schemes, isLoading, isError, refetch } = useQuery({
    queryKey: ["schemes", searchTerm, selectedCategory, selectedState],
    queryFn: () => fetchSchemes({
      search: searchTerm,
      categories: selectedCategory === "all" ? [] : [selectedCategory],
      state: selectedState === "all" ? undefined : selectedState,
    }),
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.value === category);
    const Icon = categoryData?.icon || Users;
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Government Schemes Database
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover financial assistance, subsidies, and benefits from Government of India
            </p>
            
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Set Preferences
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Set Your Preferences</DialogTitle>
                    <DialogDescription>
                      Tell us about yourself to get personalized scheme recommendations
                    </DialogDescription>
                  </DialogHeader>
                  <SchemePreferencesForm
                    onSaved={() => {
                      setPreferencesOpen(false);
                      setShowRecommendations(true);
                    }}
                  />
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="gap-2"
              >
                <Gift className="h-4 w-4" />
                {showRecommendations ? "Hide Recommendations" : "Get Recommendations"}
              </Button>
            </div>
          </div>

          {/* Recommendations Section */}
          {showRecommendations && (
            <div className="mb-8">
              <SchemeRecommendations />
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States (Central)</SelectItem>
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Schemes Grid */}
          {isError && !schemes ? (
            <div className="space-y-4 py-12 text-center" role="alert">
              <p>Could not load schemes.</p>
              <Button variant="outline" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes?.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
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
          )}

          {schemes && schemes.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schemes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}