import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  message: string;
  response: string;
  created_at: string;
  user_id: string;
}

const AdminConversations = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
      return;
    }

    if (roleLoading) return;

    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchConversations();
  }, [user, isAdmin, roleLoading, navigate]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
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

  const filteredConversations = conversations.filter(conv => 
    conv.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Conversations</h2>
            <p className="text-muted-foreground">Monitor chatbot conversations and activity</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">
              Recent Conversations ({filteredConversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">Loading conversations...</div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-primary/65 mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          User: {conv.user_id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(conv.created_at).toLocaleString()}
                        </span>
                        {detectSuspiciousContent(conv.message) && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-card p-3 rounded-lg">
                        <p className="text-sm text-foreground">
                          <span className="font-medium text-foreground">User:</span> {conv.message}
                        </p>
                      </div>
                      <div className="bg-card p-3 rounded-lg">
                        <p className="text-sm text-foreground">
                          <span className="font-medium text-foreground">Bot:</span> {conv.response}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminConversations;
