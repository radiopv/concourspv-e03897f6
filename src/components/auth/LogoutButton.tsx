import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
};

export default LogoutButton;