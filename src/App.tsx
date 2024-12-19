import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Contest from "./pages/Contest";
import ContestsList from "./pages/ContestsList";
import ContestStats from "./pages/ContestStats";
import QuestionBank from "./pages/QuestionBank";
import Winners from "./pages/Winners";
import { createClient } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

// Vérification de la présence des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes. Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin/*" element={<Admin />} />
            <Route path="contest/:id" element={<Contest />} />
            <Route path="contests" element={<ContestsList />} />
            <Route path="contest/:id/stats" element={<ContestStats />} />
            <Route path="question-bank" element={<QuestionBank />} />
            <Route path="winners" element={<Winners />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;