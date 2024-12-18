import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ContestsList from "@/pages/ContestsList";
import Contest from "@/pages/Contest";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const supabaseUrl = "https://fgnrvnyzyiaqtzsyegzn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnJ2bnl6eWlhcXR6c3llZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjAxMTUsImV4cCI6MjA0ODU5NjExNX0.Mr0AIJs9f9OEEjYUXuHISVfOBNgqfwBy8w5DhKqxo90";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/contests" element={<ProtectedRoute><ContestsList /></ProtectedRoute>} />
              <Route path="/contests/:id" element={<ProtectedRoute><Contest /></ProtectedRoute>} />
              <Route path="/admin/*" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
            </Routes>
          </Layout>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (adminPassword === 'Lechef200!!') {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticateAdmin = (password: string) => {
    if (password === 'Lechef200!!') {
      localStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
      toast({
        title: "Accès autorisé",
        description: "Bienvenue dans l'espace administrateur",
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Accès Administrateur</h2>
          <input
            type="password"
            placeholder="Mot de passe administrateur"
            className="w-full px-4 py-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                authenticateAdmin(e.currentTarget.value);
              }
            }}
          />
          <p className="text-sm text-gray-500 text-center">
            Entrez le mot de passe administrateur et appuyez sur Entrée
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default App;