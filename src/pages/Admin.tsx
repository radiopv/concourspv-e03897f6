import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import AdminAuth from "../components/admin/AdminAuth";
import { useToast } from "@/hooks/use-toast";
import AdminRoutes from "@/components/admin/AdminRoutes";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found");
          setIsAuthenticated(false);
          return;
        }

        console.log("Checking admin rights for:", session.user.email);
        
        // Vérification explicite du rôle admin
        const { data: member, error: memberError } = await supabase
          .from('members')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (memberError) {
          console.error("Error checking member role:", memberError);
          throw memberError;
        }

        if (!member) {
          console.log("Creating admin member for:", session.user.email);
          // Création automatique du membre admin
          const { error: createError } = await supabase
            .from('members')
            .insert([{
              id: session.user.id,
              email: session.user.email,
              first_name: 'Admin',
              last_name: 'User',
              role: 'admin'
            }]);

          if (createError) throw createError;
          setIsAuthenticated(true);
        } else {
          console.log("Member role found:", member.role);
          setIsAuthenticated(member.role === 'admin');
          
          if (member.role !== 'admin') {
            toast({
              title: "Accès refusé",
              description: "Vous n'avez pas les droits d'administration nécessaires.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des droits d'accès",
          variant: "destructive",
        });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

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