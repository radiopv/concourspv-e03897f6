import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../App";
import AdminAuth from "../components/admin/AdminAuth";
import { useToast } from "@/hooks/use-toast";
import AdminRoutes from "@/components/admin/AdminRoutes";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "renaudcanuel@me.com") {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté",
    });
  };

  if (!isAuthenticated) {
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