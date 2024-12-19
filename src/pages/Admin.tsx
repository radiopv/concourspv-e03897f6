import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Outlet />
    </div>
  );
};

export default Admin;