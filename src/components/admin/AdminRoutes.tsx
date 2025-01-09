import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminContestManager from "./AdminContestManager";
import QuestionBank from "../../pages/QuestionBank";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";
import ParticipantsList from "./ParticipantsList";
import DrawManager from "./DrawManager";
import Winners from "../../pages/Winners";
import GlobalSettings from "./GlobalSettings";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminRoutes = () => {
  const { contestId } = useParams();

  const menuItems = [
    { path: "/admin", label: "Tableau de bord" },
    { path: "/admin/contests", label: "Concours" },
    { path: "/admin/questions", label: "Questions" },
    { path: "/admin/prizes", label: "Prix" },
    { path: "/admin/settings", label: "Paramètres" },
  ];

  const contestMenuItems = contestId ? [
    { path: `/admin/contests/${contestId}/participants`, label: "Participants" },
    { path: `/admin/contests/${contestId}/draw`, label: "Tirage" },
    { path: `/admin/contests/${contestId}/winners`, label: "Gagnants" },
  ] : [];

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-8 bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-primary/10 hover:text-primary",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "whitespace-nowrap"
                )}
              >
                {item.label}
              </Link>
            ))}
            {contestMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-secondary/10 hover:text-secondary",
                  "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
                  "whitespace-nowrap"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="contests" element={<AdminContestManager />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="prizes" element={<PrizeCatalogManager />} />
        <Route path="settings" element={<GlobalSettings />} />
        <Route 
          path="contests/:contestId/participants" 
          element={<ParticipantsList />} 
        />
        <Route 
          path="contests/:contestId/draw" 
          element={<DrawManager />} 
        />
        <Route 
          path="contests/:contestId/winners" 
          element={<Winners />} 
        />
      </Routes>
    </div>
  );
};

export default AdminRoutes;