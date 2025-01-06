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
import { Alert, AlertDescription } from "@/components/ui/alert";

const supabaseUrl = 'https://fgnrvnyzyiaqtzsyegzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnJ2bnl6eWlhcXR6c3llZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjAxMTUsImV4cCI6MjA0ODU5NjExNX0.Mr0AIJs9f9OEEjYUXuHISVfOBNgqfwBy8w5DhKqxo90';

// Create the Supabase client with updated configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    detectSessionInUrl: false
  }
});

// Initialize session
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear local storage on sign out
    localStorage.removeItem('supabase.auth.token');
  }
});

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