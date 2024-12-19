import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QuestionBank from "@/pages/QuestionBank";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/question-bank" element={<QuestionBank />} />
    </Routes>
  );
};

export default AdminRoutes;