import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import AdminNavigation from "@/components/admin/AdminNavigation";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== "renaudcanuel@me.com") {
        toast({
          title: "Accès refusé",
          description: "Vous devez être administrateur pour accéder à cette page",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;