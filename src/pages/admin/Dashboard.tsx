import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

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
  }, [user, isAdmin, roleLoading, navigate]);

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
      <AdminAnalytics />
    </AdminLayout>
  );
};

export default AdminDashboard;
