import { Home, Trophy, Settings, LogOut, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MobileNavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.email === "renaudcanuel@me.com";

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center",
            isLinkActive("/")
              ? "text-primary font-semibold"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link 
          to="/dashboard" 
          className={cn(
            "flex flex-col items-center",
            isLinkActive("/dashboard")
              ? "text-primary font-semibold"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
        
        <Link 
          to="/contests" 
          className={cn(
            "flex flex-col items-center",
            isLinkActive("/contests")
              ? "text-primary font-semibold"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Trophy className="h-6 w-6" />
          <span className="text-xs mt-1">Concours</span>
        </Link>

        {isAdmin && (
          <Link 
            to="/admin" 
            className={cn(
              "flex flex-col items-center",
              isLinkActive("/admin")
                ? "text-primary font-semibold"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}

        <Button
          variant="ghost"
          className={cn(
            "flex flex-col items-center h-auto p-0",
            "text-gray-600 hover:text-gray-900"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          <span className="text-xs mt-1">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavBar;