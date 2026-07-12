import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Database, Loader2 } from "lucide-react";

export default function PopulateSchemes() {
  const [isPopulating, setIsPopulating] = useState(false);
  const { toast } = useToast();

  const handlePopulate = async () => {
    setIsPopulating(true);
    try {
      const response = await fetch('https://bokbbzzjjiosknxwfpvb.supabase.co/functions/v1/populate-schemes-data', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2Jienpqamlvc2tueHdmcHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDI0MjQsImV4cCI6MjA2NzA3ODQyNH0.dhCitX5fYeFJlWdkrrzHjD1rv0iKfcPyATIcywFB7Q0',
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: `Successfully populated ${result.count || 'multiple'} government schemes in the database.`,
        });
      } else {
        throw new Error(result.error || 'Failed to populate schemes');
      }
    } catch (error) {
      console.error('Error populating schemes:', error);
      toast({
        title: "Error",
        description: "Failed to populate schemes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Populate Government Schemes Database</CardTitle>
            <CardDescription>
              This will add sample government schemes from various ministries and states to the database.
              This is a one-time setup to get you started with the scheme recommendation system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What will be added:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Financial schemes (PM-KISAN, Direct Benefit Transfer, etc.)</li>
                <li>• Education schemes (Scholarships, Skill Development, etc.)</li>
                <li>• Health schemes (Ayushman Bharat, Health Insurance, etc.)</li>
                <li>• Agriculture schemes (Crop Insurance, Fertilizer Subsidy, etc.)</li>
                <li>• Women empowerment schemes</li>
                <li>• Employment schemes (MGNREGA, Startup India, etc.)</li>
              </ul>
            </div>

            <Button 
              onClick={handlePopulate} 
              disabled={isPopulating}
              className="w-full"
              size="lg"
            >
              {isPopulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPopulating ? "Populating Database..." : "Populate Schemes Database"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This process may take a few moments to complete. Please don't refresh the page.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}