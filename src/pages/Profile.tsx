import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Phone, Mail, Calendar, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    display_name: "",
    village: "",
    state: "",
    phone: "",
  });

  // Load profile from database
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        return;
      }

      if (data) {
        setProfile({
          display_name: data.display_name || "",
          village: data.village || "",
          state: data.state || "",
          phone: data.phone || "",
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const achievements = [
    { title: "Financial Literacy Badge", description: "Completed basic financial education", color: "bg-primary" },
    { title: "Digital Payment Expert", description: "Successfully used UPI 50+ times", color: "bg-success" },
    { title: "Fraud Prevention Specialist", description: "Identified 5 fraudulent messages", color: "bg-destructive" },
    { title: "Savings Champion", description: "Maintained savings goal for 3 months", color: "bg-accent" },
  ];

  const stats = [
    { label: "Learning Sessions", value: "24", icon: TrendingUp },
    { label: "Games Completed", value: "15", icon: Award },
    { label: "Credit Score", value: "750", icon: TrendingUp },
    { label: "Savings Goal", value: "₹25,000", icon: TrendingUp },
  ];

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          village: profile.village,
          state: profile.state,
          phone: profile.phone,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 shadow-warm">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="space-y-4 w-full max-w-md">
                  <div>
                    <Label htmlFor="display_name">Name</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="village">Village/City</Label>
                    <Input
                      id="village"
                      value={profile.village}
                      onChange={(e) => setProfile({...profile, village: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profile.state}
                      onChange={(e) => setProfile({...profile, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} className="btn-primary">
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {profile.display_name || "User"}
                  </h1>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
                    {profile.village && profile.state && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.village}, {profile.state}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {user?.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    className="mt-4 btn-secondary"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>


        {/* Statistics */}
        <Card className="mb-8 shadow-warm">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your financial literacy journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-accent/30 rounded-lg">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-8 shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Celebrate your financial learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-accent/30 rounded-lg">
                  <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions with वित्त सखी</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Played Budgeting Game</h4>
                  <p className="text-sm text-muted-foreground">Achieved high score in monthly budget challenge</p>
                </div>
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  1 week ago
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Fraud Message Detected</h4>
                  <p className="text-sm text-muted-foreground">Successfully identified fake lottery message</p>
                </div>
                <Badge variant="outline" className="bg-destructive text-destructive-foreground">
                  2 weeks ago
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;