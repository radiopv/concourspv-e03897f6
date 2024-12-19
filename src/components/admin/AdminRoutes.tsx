import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";
import Contest from "@/pages/Contest";
import ContestStats from "@/components/contests/ContestStats";
import ContestList from "./ContestList";
import ContentValidator from "./ContentValidator";
import { PrizeCatalogManager } from "./prize-catalog/PrizeCatalogManager";
import QuestionsManager from "./QuestionsManager";

const AdminRoutes = () => {
  const navigate = useNavigate();
  const params = useParams();

  const handleSelectContest = (id: string) => {
    navigate(`/admin/contests/${id}`);  // Correction du chemin
  };

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/contests" element={<ContestList onSelectContest={handleSelectContest} />} />
      <Route path="/contests/:id" element={<Contest />} />
      <Route path="/contests/:id/questions" element={<QuestionsManager contestId={params.id || ''} />} />
      <Route path="/contests/:id/stats" element={<ContestStats contestId={params.id || ''} />} />
      <Route path="/prize-catalog" element={<PrizeCatalogManager />} />
      <Route path="/content-validator" element={<ContentValidator />} />
    </Routes>
  );
};

export default AdminRoutes;