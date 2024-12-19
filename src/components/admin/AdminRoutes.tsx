import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";
import Contest from "@/pages/Contest";
import ContestStats from "@/pages/ContestStats";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";
import ContestList from "./ContestList";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="question-bank" element={<QuestionBank />} />
      <Route path="contests" element={<ContestList />} />
      <Route path="contests/:id" element={<Contest />} />
      <Route path="contests/:id/stats" element={<ContestStats />} />
      <Route path="prize-catalog" element={<PrizeCatalogManager />} />
    </Routes>
  );
};

export default AdminRoutes;