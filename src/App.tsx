import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import ContestsList from "./pages/ContestsList";
import Contest from "./pages/Contest";
import Winners from "./pages/Winners";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contests" element={<ContestsList />} />
          <Route path="/contest/:id" element={<Contest />} />
          <Route path="/winners" element={<Winners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;