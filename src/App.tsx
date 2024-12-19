import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "@/pages/Admin";
import AdminRoutes from "@/components/admin/AdminRoutes";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import Contest from "@/pages/Contest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contests/:id" element={<Contest />} />
        
        {/* Routes d'administration */}
        <Route path="/admin/*" element={<Admin />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;