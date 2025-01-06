import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const UserNavBar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
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
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                >
                  Déconnexion
                </Button>
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