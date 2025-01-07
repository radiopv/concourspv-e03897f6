import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminAuth from "../components/admin/AdminAuth";
import { useToast } from "@/hooks/use-toast";
import AdminRoutes from "@/components/admin/AdminRoutes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminAuth = async () => {
      console.log("Checking admin authentication for user:", user?.email);
      
      if (user?.email === "renaudcanuel@me.com") {
        console.log("Admin user detected, setting authenticated state");
        setIsAuthenticated(true);
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", user.email);
      } else if (user) {
        console.log("Non-admin user detected, redirecting");
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration",
          variant: "destructive",
        });
        navigate('/dashboard');
      } else {
        console.log("No user detected, redirecting to login");
        navigate('/login');
      }
    };

    checkAdminAuth();
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminEmail");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté",
    });
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  if (!isAuthenticated && user.email !== "renaudcanuel@me.com") {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Administration</h1>
        <Button variant="outline" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
      <AdminRoutes />
    </div>
  );
};

export default Admin;