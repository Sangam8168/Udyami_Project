import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, MessageSquare, AlertTriangle, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserRoleManager } from "@/components/admin/UserRoleManager";

interface ConversationData {
  id: string;
  message: string;
  response: string;
  created_at: string;
  user_id: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/admin-auth");
      return;
    }

    // Wait for role loading to complete
    if (roleLoading) return;

    // Check if user is admin using role-based system
    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchConversations();
  }, [user, navigate, isAdmin, roleLoading]);

  const fetchConversations = async () => {
    try {
      // Call secure edge function with server-side admin verification
      const { data, error } = await supabase.functions.invoke('admin-conversations', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      if (data?.success && data?.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // If unauthorized, redirect to home
      if (error?.message?.includes('403') || error?.message?.includes('Forbidden')) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const detectSuspiciousContent = (message: string) => {
    const suspiciousKeywords = ['fake', 'scam', 'fraud', 'cheat', 'hack', 'illegal'];
    return suspiciousKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  };

  if (!user || roleLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Monitor chatbot conversations and system activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(conversations.map(c => c.user_id)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Messages</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversations.filter(c => detectSuspiciousContent(c.message)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              User Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading conversations...</p>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            User: {conv.user_id.slice(0, 8)}...
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(conv.created_at).toLocaleString()}
                            </span>
                            {detectSuspiciousContent(conv.message) && (
                              <Badge variant="destructive">Flagged</Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong>User:</strong> {conv.message}
                          </div>
                          <div>
                            <strong>Bot:</strong> {conv.response.slice(0, 200)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <UserRoleManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;