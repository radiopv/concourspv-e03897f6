import React from 'react';
import { Home, Settings, User, Trophy, BookOpen, Grid, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavBarProps {
  isAdmin: boolean;
}

const MobileNavBar = ({ isAdmin }: MobileNavBarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userLinks = [
    {
      title: "Accueil",
      path: "/",
      icon: Home
    },
    {
      title: "Concours",
      path: "/contests",
      icon: Trophy
    },
    {
      title: "Prix",
      path: "/prizes",
      icon: Gift
    },
    {
      title: "Points",
      path: "/points",
      icon: Gift
    },
    {
      title: "Instructions",
      path: "/instructions",
      icon: BookOpen
    },
    {
      title: "Profil",
      path: "/dashboard",
      icon: User
    }
  ];

  const adminLinks = [
    {
      title: "Admin",
      path: "/admin",
      icon: Grid
    },
    {
      title: "Paramètres",
      path: "/admin/settings",
      icon: Settings
    }
  ];

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        {links.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex flex-col items-center ${
              location.pathname === link.path 
                ? "text-amber-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <link.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavBar;