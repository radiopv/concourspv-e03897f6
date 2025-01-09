import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contest from "./pages/Contest";
import ContestsList from "./pages/ContestsList";
import ContestStats from "./pages/ContestStats";
import Admin from "./pages/Admin";
import Winners from "./pages/Winners";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contests" element={<ContestsList />} />
            <Route path="/contest/:contestId" element={<Contest />} />
            <Route path="/contest/:contestId/stats" element={<ContestStats />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/winners" element={<Winners />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}