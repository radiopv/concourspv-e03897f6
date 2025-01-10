import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from "@/components/Layout";
import ContestPrizeManager from "@/components/admin/ContestPrizeManager";
import PrizeCatalogManager from "@/components/admin/prize-catalog/PrizeCatalogManager";
import PrizesPage from "@/pages/Prizes";
import Admin from "@/pages/Admin";
import Home from "@/pages/Home";
import ContestsList from "@/pages/ContestsList";
import Contest from "@/pages/Contest";
import Dashboard from "@/pages/Dashboard";
import Winners from "@/pages/Winners";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<ContestsList />} />
            <Route path="/contests/:contestId" element={<Contest />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/admin/prizes" element={<PrizeCatalogManager />} />
            <Route 
              path="/admin/contest-prizes/:contestId" 
              element={<ContestPrizeManager />} 
            />
            <Route path="/prizes" element={<PrizesPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;