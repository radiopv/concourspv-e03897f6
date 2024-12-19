import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Tableau de bord" },
    { path: "/admin/contests", label: "Concours" },
    { path: "/admin/question-bank", label: "Banque de questions" },
    { path: "/admin/prize-catalog", label: "Catalogue des prix" },
    { path: "/admin/content-validator", label: "Validation du contenu" }
  ];

  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-md whitespace-nowrap transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;