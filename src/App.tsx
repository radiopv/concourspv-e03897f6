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
import { createClient } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Les variables d\'environnement Supabase sont manquantes');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

const queryClient = new QueryClient();

export default function App() {
  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="container mx-auto p-4 mt-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de Configuration</AlertTitle>
          <AlertDescription>
            Les variables d'environnement Supabase (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) sont manquantes.
            Veuillez configurer votre fichier .env avec les bonnes valeurs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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