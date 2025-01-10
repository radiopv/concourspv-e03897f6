import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User, Trophy } from 'lucide-react';
import UserPoints from './UserPoints';

const UserNavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-amber-100">
              <Trophy className="h-6 w-6" />
              <span className="font-bold text-lg">Concours</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/contests" className="text-white hover:text-amber-100">
                Concours
              </Link>
              <Link to="/winners" className="text-white hover:text-amber-100">
                Gagnants
              </Link>
              <Link to="/points" className="text-white hover:text-amber-100">
                Points
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-white hover:text-amber-100 font-semibold">
                  Administration
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserPoints />
                <div className="hidden md:flex space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-white hover:text-amber-100">
                      <User className="h-5 w-5 mr-2" />
                      Profil
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" className="text-white hover:text-amber-100">
                        <Settings className="h-5 w-5 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-amber-100" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-amber-100">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" className="text-white hover:text-amber-100">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;