import { Link } from "react-router-dom";
import { Gift, Home, Trophy, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";

interface UserNavBarProps {
  isAdmin?: boolean;
}

interface ExtendedUser extends User {
  avatar_url?: string | null;
}

const UserNavBar = ({ isAdmin }: UserNavBarProps) => {
  const { user, signOut } = useAuth();
  const extendedUser = user as ExtendedUser;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-600">
                Concours
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-purple-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Link>

              <Link
                to="/contests"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-purple-600"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Concours
              </Link>

              <Link
                to="/prizes"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-purple-600"
              >
                <Gift className="h-4 w-4 mr-2" />
                Cadeaux à Gagner
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {extendedUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={extendedUser.avatar_url || undefined} alt={extendedUser.email} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;