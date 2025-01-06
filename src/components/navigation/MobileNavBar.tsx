import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, User, Award } from 'lucide-react';

const MobileNavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>

        <Link
          to="/contests"
          className={`flex flex-col items-center justify-center ${
            isActive('/contests') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-xs mt-1">Concours</span>
        </Link>

        <Link
          to="/winners"
          className={`flex flex-col items-center justify-center ${
            isActive('/winners') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Award className="h-5 w-5" />
          <span className="text-xs mt-1">Gagnants</span>
        </Link>

        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavBar;