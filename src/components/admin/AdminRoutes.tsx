import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";
import Contest from "@/pages/Contest";
import ContestStats from "@/pages/ContestStats";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="question-bank" element={<QuestionBank />} />
      <Route path="contests/:id" element={<Contest />} />
      <Route path="contests/:id/stats" element={<ContestStats />} />
    </Routes>
  );
};

export default AdminRoutes;