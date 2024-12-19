import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "@/pages/Admin";
import AdminRoutes from "@/components/admin/AdminRoutes";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
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
