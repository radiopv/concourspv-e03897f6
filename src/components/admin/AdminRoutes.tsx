import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";
import Contest from "@/pages/Contest";
import ContestStats from "@/components/contests/ContestStats";
import ContestList from "./ContestList";
import ContentValidator from "./ContentValidator";
import { PrizeCatalogManager } from "./prize-catalog/PrizeCatalogManager";

const AdminRoutes = () => {
  const navigate = useNavigate();

  const handleSelectContest = (id: string) => {
    navigate(`/admin/contests/${id}`);
  };

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/contests" element={<ContestList onSelectContest={handleSelectContest} />} />
      <Route path="/contests/:id" element={<Contest />} />
      <Route path="/contests/:id/stats" element={<ContestStats contestId={useParams().id || ''} />} />
      <Route path="/prize-catalog" element={<PrizeCatalogManager />} />
      <Route path="/content-validator" element={<ContentValidator />} />
    </Routes>
  );
};

export default AdminRoutes;