import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserPoints from "./UserPoints";
import { Shield } from 'lucide-react';

const UserNavBar = () => {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 shadow-lg border-b border-amber-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-2xl font-bold text-white drop-shadow-md hover:scale-105 transition-transform"
            >
              Concours
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/contests" 
                className="text-white hover:text-amber-100 transition-colors font-medium"
              >
                Participer
              </Link>
              <Link 
                to="/points" 
                className="text-white hover:text-amber-100 transition-colors font-medium"
              >
                Points & Rangs
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-amber-100 transition-colors font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Administration
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserPoints />
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-amber-200 text-white hover:bg-white/20 hover:text-amber-100 backdrop-blur-sm"
                  >
                    Mon compte
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="text-white hover:bg-white/10 hover:text-amber-100"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline"
                    className="bg-white/10 border-amber-200 text-white hover:bg-white/20 hover:text-amber-100 backdrop-blur-sm"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-200/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;