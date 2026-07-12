import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, Crown, User } from 'lucide-react';

interface UserWithRole {
  user_id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export const UserRoleManager = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at
        `);

      if (error) throw error;

      // Also fetch profiles separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name');

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p.display_name]) || []);

      const usersWithEmails = data?.map(user => ({
        user_id: user.user_id,
        email: `user-${user.user_id.slice(0, 8)}`, // Placeholder since we can't access auth.users directly
        display_name: profilesMap.get(user.user_id) || 'Unknown',
        role: user.role as 'admin' | 'user',
        created_at: user.created_at
      })) || [];

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUserRole = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      // First, we need to find the user by email
      // Note: In a real implementation, you'd need a way to look up users by email
      // For now, this is a placeholder that assumes you have the user_id
      
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: searchEmail, // This should be the actual user_id
          role: selectedRole
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${selectedRole}`,
      });

      setSearchEmail('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add User Role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="user-search">User ID or Email</Label>
              <Input
                id="user-search"
                placeholder="Enter user ID..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role-select">Role</Label>
              <Select value={selectedRole} onValueChange={(value: 'admin' | 'user') => setSelectedRole(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addUserRole} 
                disabled={actionLoading}
                className="w-full"
              >
                {actionLoading ? "Adding..." : "Add Role"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Users & Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Crown className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.display_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Note:</strong> To make the first admin, use the SQL script provided or run:</p>
            <code className="block bg-background p-2 rounded text-xs">
              INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id', 'admin');
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};