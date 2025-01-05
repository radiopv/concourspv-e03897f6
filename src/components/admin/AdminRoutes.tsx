import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminContestManager from "./AdminContestManager";
import QuestionBank from "../../pages/QuestionBank";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";

const AdminRoutes = () => {
  return (
    <div className="container mx-auto p-4">
      <nav className="mb-8">
        <ul className="flex space-x-4 overflow-x-auto pb-4">
          <li>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              to="/admin/contests"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Concours
            </Link>
          </li>
          <li>
            <Link
              to="/admin/questions"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Questions
            </Link>
          </li>
          <li>
            <Link
              to="/admin/prizes"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Catalogue des prix
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="contests/*" element={<AdminContestManager />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="prizes" element={<PrizeCatalogManager />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;