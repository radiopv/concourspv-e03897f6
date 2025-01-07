import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminContestManager from "./AdminContestManager";
import QuestionBank from "@/pages/QuestionBank";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";
import GlobalSettings from "./GlobalSettings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="contests/*" element={<AdminContestManager />} />
      <Route path="questions" element={<QuestionBank />} />
      <Route path="prizes" element={<PrizeCatalogManager />} />
      <Route path="settings" element={<GlobalSettings />} />
    </Routes>
  );
};

export default AdminRoutes;