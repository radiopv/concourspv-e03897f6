import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Toaster } from "react-hot-toast";
import PointsSystem from "@/pages/PointsSystem";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import ContestCard from "@/components/contests/ContestCard";
import ContestsList from "@/pages/ContestsList";
import Dashboard from "@/pages/Dashboard";
import Contest from "@/pages/Contest";
import WinnersList from "@/pages/WinnersList";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<ContestsList />} />
              <Route path="/contests" element={<ContestsList />} />
              <Route path="/contest/:id" element={<Contest />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/winners" element={<WinnersList />} />
              <Route path="/points" element={<PointsSystem />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Layout>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;