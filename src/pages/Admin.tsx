import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { supabase } from "@/lib/supabase";

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

  return <AdminDashboard />;
};

export default Admin;
