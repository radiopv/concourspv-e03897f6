import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserNavBar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              Accueil
            </Link>
            
            <Link
              to="/contests"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              Concours
            </Link>

            <Link
              to="/winners"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              Gagnants
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Administration
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;