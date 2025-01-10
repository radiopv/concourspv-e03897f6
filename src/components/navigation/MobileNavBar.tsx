import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, User, Trophy, Settings } from "lucide-react";

interface MobileNavBarProps {
  isAdmin: boolean;
}

const MobileNavBar = ({ isAdmin }: MobileNavBarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden">
      <div className="flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            location.pathname === "/" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Accueil</span>
        </Link>

        <Link
          to="/dashboard"
          className={`flex flex-col items-center ${
            location.pathname === "/dashboard" ? "text-primary" : "text-gray-500"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Compte</span>
        </Link>

        <Link
          to="/winners"
          className={`flex flex-col items-center ${
            location.pathname === "/winners" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Trophy className="h-6 w-6" />
          <span className="text-xs">Gagnants</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center ${
              location.pathname.startsWith("/admin") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileNavBar;