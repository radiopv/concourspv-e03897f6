import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, Trophy } from 'lucide-react';
import UserPoints from './UserPoints';

interface UserNavBarProps {
  isAdmin: boolean;
}

const UserNavBar = ({ isAdmin }: UserNavBarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-lg font-semibold"
              onClick={() => navigate('/')}
            >
              Concours
            </Button>
            
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <UserPoints />
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Mon compte
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/winners')}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Gagnants
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/login')}>
                Se connecter
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')}>
                S'inscrire
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;