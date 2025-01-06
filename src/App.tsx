import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { createClient } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";

const supabaseUrl = 'https://fgnrvnyzyiaqtzsyegzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnJ2bnl6eWlhcXR6c3llZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjAxMTUsImV4cCI6MjA0ODU5NjExNX0.Mr0AIJs9f9OEEjYUXuHISVfOBNgqfwBy8w5DhKqxo90';

export const supabase = createClient(supabaseUrl, supabaseKey);

const queryClient = new QueryClient();

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <AuthenticatedRoute>
                    <Dashboard />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/contests" 
                element={
                  <AuthenticatedRoute>
                    <ContestsList />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/contest/:contestId" 
                element={
                  <AuthenticatedRoute>
                    <Contest />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/contest/:contestId/stats" 
                element={
                  <AuthenticatedRoute>
                    <ContestStats />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/admin/*" 
                element={
                  <AuthenticatedRoute>
                    <Admin />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/winners" 
                element={
                  <AuthenticatedRoute>
                    <Winners />
                  </AuthenticatedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}