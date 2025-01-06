import { Link } from "react-router-dom";
import { Trophy, Menu, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserNavBar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = user?.email === "renaudcanuel@me.com";

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
      <Link
        to="/"
        className="text-gray-900 hover:text-gray-600 transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Accueil
      </Link>
      {user && (
        <>
          <Link
            to="/dashboard"
            className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4" />
            {user.email}
          </Link>
          <Link
            to="/contests"
            className="text-gray-900 hover:text-gray-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Concours
          </Link>
          <Link
            to="/winners"
            className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Trophy className="w-4 h-4" />
            Gagnants
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Administration
            </Link>
          )}
          <Button
            variant="ghost"
            className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2 p-0 h-auto"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </>
      )}
      {!user && (
        <Link
          to="/login"
          className="text-gray-900 hover:text-gray-600 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Connexion
        </Link>
      )}
    </div>
  );

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Concours
          </Link>
          
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <NavLinks />
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;