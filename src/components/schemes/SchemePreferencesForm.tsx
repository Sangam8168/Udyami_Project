import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SchemeNotifications } from "./SchemeNotifications";

const INCOME_LEVELS = [
  { value: "low", label: "Low (Below ₹2,50,000/year)" },
  { value: "middle", label: "Middle (₹2,50,000 - ₹10,00,000/year)" },
  { value: "high", label: "High (Above ₹10,00,000/year)" },
];

const OCCUPATIONS = [
  "Farmer", "Student", "Government Employee", "Private Employee", "Self-employed", 
  "Unemployed", "Retired", "Homemaker", "Daily Wage Laborer", "Business Owner"
];

const EDUCATION_LEVELS = [
  "Below 10th", "10th Pass", "12th Pass", "Graduate", "Post Graduate", "Professional Degree"
];

const CATEGORIES = [
  "finance", "education", "health", "agriculture", "women", "employment"
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface FormData {
  income_level: string;
  occupation: string;
  education_level: string;
  location_type: string;
  state: string;
  gender: string;
  age: number;
  family_size: number;
  interested_categories: string[];
  notification_enabled: boolean;
  email_notifications: boolean;
}

export function SchemePreferencesForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [interestedCategories, setInterestedCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      notification_enabled: true,
      email_notifications: true,
      interested_categories: [],
    }
  });

  // Load existing preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_scheme_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading preferences:", error);
        return;
      }

      if (data) {
        reset({
          income_level: data.income_level || "",
          occupation: data.occupation || "",
          education_level: data.education_level || "",
          location_type: data.location_type || "",
          state: data.state || "",
          gender: data.gender || "",
          age: data.age || 18,
          family_size: data.family_size || 1,
          interested_categories: data.interested_categories || [],
          notification_enabled: data.notification_enabled,
          email_notifications: data.email_notifications,
        });
        setInterestedCategories(data.interested_categories || []);
      }
    };

    loadPreferences();
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // First clean up any duplicate entries
      await supabase
        .from("user_scheme_preferences")
        .delete()
        .eq("user_id", user.id);

      // Then insert the new preferences
      const { error } = await supabase
        .from("user_scheme_preferences")
        .insert({
          user_id: user.id,
          ...data,
          interested_categories: interestedCategories,
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your scheme preferences have been updated successfully.",
      });

      // Navigate back to schemes page
      setTimeout(() => {
        window.history.pushState({}, '', '/schemes');
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...interestedCategories, category]
      : interestedCategories.filter(c => c !== category);
    
    setInterestedCategories(updatedCategories);
    setValue("interested_categories", updatedCategories);
  };

  return (
    <div className="space-y-6">
      {user && <SchemeNotifications />}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="income_level">Income Level</Label>
          <Select 
            value={watch("income_level")} 
            onValueChange={(value) => setValue("income_level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select income level" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Select 
            value={watch("occupation")} 
            onValueChange={(value) => setValue("occupation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              {OCCUPATIONS.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education_level">Education Level</Label>
          <Select 
            value={watch("education_level")} 
            onValueChange={(value) => setValue("education_level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_type">Location Type</Label>
          <Select 
            value={watch("location_type")} 
            onValueChange={(value) => setValue("location_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rural">Rural</SelectItem>
              <SelectItem value="urban">Urban</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select 
            value={watch("state")} 
            onValueChange={(value) => setValue("state", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={watch("gender")} 
            onValueChange={(value) => setValue("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="100"
            {...register("age", { valueAsNumber: true })}
            placeholder="Enter your age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="family_size">Family Size</Label>
          <Input
            id="family_size"
            type="number"
            min="1"
            max="20"
            {...register("family_size", { valueAsNumber: true })}
            placeholder="Number of family members"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interested Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={interestedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notification_enabled"
              {...register("notification_enabled")}
            />
            <Label htmlFor="notification_enabled">
              Enable scheme notifications
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email_notifications"
              {...register("email_notifications")}
            />
            <Label htmlFor="email_notifications">
              Email notifications for new schemes and deadlines
            </Label>
          </div>
        </CardContent>
      </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </div>
  );
}