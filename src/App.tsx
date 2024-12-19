import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import RandomDraw from './pages/RandomDraw';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contest from './pages/Contest';
import ContestsList from './pages/ContestsList';
import Winners from './pages/Winners';
import ContestStats from './pages/ContestStats';
import Admin from './pages/Admin';
import AdminRoutes from './components/admin/AdminRoutes';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tirage" element={<RandomDraw />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contest/:id" element={<Contest />} />
          <Route path="/contests" element={<ContestsList />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/contest-stats/:id" element={<ContestStats contestId="" />} />
          
          {/* Routes d'administration */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;