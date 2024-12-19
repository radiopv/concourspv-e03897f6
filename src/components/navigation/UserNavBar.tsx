import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

const UserNavBar = () => {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
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
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Concours
            </Link>
            <Link
              to="/winners"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Gagnants
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;