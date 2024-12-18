import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../App";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
};