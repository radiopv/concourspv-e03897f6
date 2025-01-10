import { Home, Settings, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link 
          to="/" 
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link 
          to="/contests" 
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Concours</span>
        </Link>

        {isAdmin && (
          <Link 
            to="/admin" 
            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
          >
            <Shield className="h-6 w-6" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}

        <Link 
          to="/dashboard" 
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavBar;