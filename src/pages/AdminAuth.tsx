import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const adminEmails = [
    "admin@udyami.com",
    "sangam8168@gmail.com" // Add your admin emails here
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if email is in admin list
    if (!adminEmails.includes(email)) {
      setError("Access denied. Admin credentials required.");
      setLoading(false);
      return;
    }

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Add admin role using security definer function
      if (data?.user) {
        const { error: roleError } = await supabase.rpc('set_admin_role' as any, {
          target_user_id: data.user.id
        });
        
        if (roleError) {
          console.error('Error setting admin role:', roleError);
          setError(`Failed to set admin role: ${roleError.message}`);
          setLoading(false);
          return;
        }
      }
      
      toast({
        title: "Success",
        description: "Successfully signed in as admin!",
      });
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-8">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Udyami Administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@udyami.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in as Admin"}
            </Button>
            
            <div className="grid gap-2 border-t pt-4">
              <Button asChild variant="outline">
                <Link to="/auth">Switch to User Login</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">
                  <ArrowLeft aria-hidden="true" />
                  Back to Main Site
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;