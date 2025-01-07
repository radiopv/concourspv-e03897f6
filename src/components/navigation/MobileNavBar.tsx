import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNavBar = () => {
  const { isAdmin } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Accueil
          </Link>
          
          <Link
            to="/contests"
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Concours
          </Link>

          <Link
            to="/winners"
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Gagnants
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Administration
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavBar;