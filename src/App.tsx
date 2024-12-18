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
  const { session, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.email) {
        setIsAdmin(false);
        return;
      }
      
      if (session.user.email === "renaudcanuel@me.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [session]);

  if (loading || isAdmin === null) {
    return <div>Vérification des droits d'accès...</div>;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default App;