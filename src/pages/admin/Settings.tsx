import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminSettingsPage = () => {
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <AdminSettings />
    </AdminLayout>
  );
};

export default AdminSettingsPage;
