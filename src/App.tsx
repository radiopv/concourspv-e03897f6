import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ContestsList from "@/pages/ContestsList";
import Contest from "@/pages/Contest";
import Admin from "@/pages/Admin";

const supabaseUrl = "https://fgnrvnyzyiaqtzsyegzn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnJ2bnl6eWlhcXR6c3llZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MjIyNTgsImV4cCI6MjAxODQ5ODI1OH0.qDw_7IgyDaWqzWdC_SQZTjRGJJTXF7Hg5ByEUXkOeAM";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contests" element={<ContestsList />} />
            <Route path="/contests/:id" element={<Contest />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;