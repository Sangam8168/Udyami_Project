import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchSchemePreferences, saveSchemePreferences } from "@/lib/schemePreferences";
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

export function SchemePreferencesForm({ onSaved }: { onSaved?: () => void }) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const preferencesKey = ["scheme-preferences", user?.id];
  const { data: preferences, isPending, isError, refetch } = useQuery({
    queryKey: preferencesKey,
    queryFn: () => fetchSchemePreferences(user?.id),
    enabled: !authLoading,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      notification_enabled: true,
      email_notifications: true,
      interested_categories: [],
    },
  });

  useEffect(() => {
    if (preferences) {
      reset({
        income_level: preferences.income_level ?? "",
        occupation: preferences.occupation ?? "",
        education_level: preferences.education_level ?? "",
        location_type: preferences.location_type ?? "",
        state: preferences.state ?? "",
        gender: preferences.gender ?? "",
        age: preferences.age ?? undefined,
        family_size: preferences.family_size ?? undefined,
        interested_categories: preferences.interested_categories ?? [],
        notification_enabled: preferences.notification_enabled ?? true,
        email_notifications: preferences.email_notifications ?? true,
      });
    }
  }, [preferences, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const saved = await saveSchemePreferences(user?.id, {
        id: preferences?.id,
        ...data,
        age: Number.isFinite(data.age) ? data.age : null,
        family_size: Number.isFinite(data.family_size) ? data.family_size : null,
      });

      queryClient.setQueryData(preferencesKey, saved);
      void queryClient.invalidateQueries({ queryKey: ["scheme-recommendations", user?.id] });
      toast({ title: user ? "Preferences saved" : "Preferences saved on this device" });

      if (onSaved) onSaved();
      else navigate("/schemes");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Could not save preferences",
        description: "Your edits are still in the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const interestedCategories = watch("interested_categories");

  if (authLoading || isPending) {
    return <p role="status">Loading preferences…</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3" role="alert">
        <p>Could not load your saved preferences.</p>
        <Button variant="outline" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user ? <SchemeNotifications /> : (
        <p className="text-sm text-muted-foreground">Your preferences are saved in this browser.</p>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="income_level">Income Level</Label>
          <Select 
            value={watch("income_level") ?? ""}
            onValueChange={(value) => setValue("income_level", value)}
          >
            <SelectTrigger id="income_level">
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
            value={watch("occupation") ?? ""}
            onValueChange={(value) => setValue("occupation", value)}
          >
            <SelectTrigger id="occupation">
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
            value={watch("education_level") ?? ""}
            onValueChange={(value) => setValue("education_level", value)}
          >
            <SelectTrigger id="education_level">
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
            value={watch("location_type") ?? ""}
            onValueChange={(value) => setValue("location_type", value)}
          >
            <SelectTrigger id="location_type">
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
            value={watch("state") ?? ""}
            onValueChange={(value) => setValue("state", value)}
          >
            <SelectTrigger id="state">
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
            value={watch("gender") ?? ""}
            onValueChange={(value) => setValue("gender", value)}
          >
            <SelectTrigger id="gender">
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
                  onCheckedChange={(checked) => setValue(
                    "interested_categories",
                    checked === true
                      ? [...interestedCategories, category]
                      : interestedCategories.filter((value) => value !== category)
                  )}
                />
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification_enabled"
                checked={watch("notification_enabled")}
                onCheckedChange={(checked) => setValue("notification_enabled", checked === true)}
              />
              <Label htmlFor="notification_enabled">
                Enable scheme notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="email_notifications"
                checked={watch("email_notifications")}
                onCheckedChange={(checked) => setValue("email_notifications", checked === true)}
              />
              <Label htmlFor="email_notifications">
                Email notifications for new schemes and deadlines
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </div>
  );
}