import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/LogoutButton';

const UserNavBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-lg font-semibold ${isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Accueil
            </Link>
            {user && (
              <>
                <Link 
                  to="/contests" 
                  className={`text-lg ${isActive('/contests') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                >
                  Concours
                </Link>
                <Link 
                  to="/winners" 
                  className={`text-lg ${isActive('/winners') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                >
                  Gagnants
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`text-sm ${isActive('/dashboard') ? 'text-primary' : 'text-gray-700'}`}>
                    Mon Profil
                  </span>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link to="/login">
                <Button>Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;