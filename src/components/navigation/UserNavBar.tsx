import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, User } from 'lucide-react';
import { cn } from "@/lib/utils";

const UserNavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/contests', label: 'Concours', icon: Trophy },
    { path: '/dashboard', label: 'Mon Profil', icon: User },
  ];

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center md:justify-start space-x-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-gray-100",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;