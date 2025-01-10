import React from 'react';
import { Home, Settings, User, Shield, Gift, Trophy, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MobileNavBarProps {
  isAdmin: boolean;
}

const MobileNavBar = ({ isAdmin }: MobileNavBarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link 
          to="/" 
          className={`flex flex-col items-center text-gray-600 hover:text-purple-600 ${
            location.pathname === '/' ? 'text-purple-600' : ''
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link 
          to="/contests" 
          className={`flex flex-col items-center text-gray-600 hover:text-purple-600 ${
            location.pathname.includes('/contests') ? 'text-purple-600' : ''
          }`}
        >
          <Trophy className="h-6 w-6" />
          <span className="text-xs mt-1">Concours</span>
        </Link>

        <Link 
          to="/prizes" 
          className={`flex flex-col items-center text-gray-600 hover:text-purple-600 ${
            location.pathname === '/prizes' ? 'text-purple-600' : ''
          }`}
        >
          <Gift className="h-6 w-6" />
          <span className="text-xs mt-1">Cadeaux</span>
        </Link>

        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center text-gray-600 hover:text-purple-600 ${
            location.pathname === '/dashboard' ? 'text-purple-600' : ''
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profil</span>
        </Link>

        {isAdmin && (
          <Link 
            to="/admin" 
            className={`flex flex-col items-center text-gray-600 hover:text-purple-600 ${
              location.pathname.includes('/admin') ? 'text-purple-600' : ''
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavBar;