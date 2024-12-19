import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";
import Contest from "@/pages/Contest";
import ContestStats from "@/pages/ContestStats";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";
import ContestList from "./ContestList";
import { useNavigate } from "react-router-dom";

const AdminRoutes = () => {
  const navigate = useNavigate();

  const handleSelectContest = (id: string) => {
    navigate(`/admin/contests/${id}`);
  };

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="question-bank" element={<QuestionBank />} />
      <Route path="contests" element={<ContestList contests={[]} onSelectContest={handleSelectContest} />} />
      <Route path="contests/:id" element={<Contest />} />
      <Route path="contests/:id/stats" element={<ContestStats />} />
      <Route path="prize-catalog" element={<PrizeCatalogManager />} />
    </Routes>
  );
};

export default AdminRoutes;