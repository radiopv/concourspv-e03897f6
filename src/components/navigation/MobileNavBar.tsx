import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, User, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MobileNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => handleNavigation('/')}
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </button>

        <button
          onClick={() => handleNavigation('/contests')}
          className={`flex flex-col items-center justify-center ${
            isActive('/contests') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-xs mt-1">Concours</span>
        </button>

        <button
          onClick={() => handleNavigation('/winners')}
          className={`flex flex-col items-center justify-center ${
            isActive('/winners') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Award className="h-5 w-5" />
          <span className="text-xs mt-1">Gagnants</span>
        </button>

        <button
          onClick={() => handleNavigation('/dashboard')}
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profil</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNavBar;