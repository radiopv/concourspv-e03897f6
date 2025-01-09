import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserPoints from "./UserPoints";

const UserNavBar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Concours
            </Link>
            <Link to="/contests" className="text-gray-600 hover:text-gray-900">
              Participer
            </Link>
            <Link to="/winners" className="text-gray-600 hover:text-gray-900">
              Gagnants
            </Link>
            <Link to="/points" className="text-gray-600 hover:text-gray-900">
              Points & Rangs
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserPoints />
                <Link to="/dashboard">
                  <Button variant="outline">Mon compte</Button>
                </Link>
                <Button variant="ghost" onClick={signOut}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button>Inscription</Button>
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