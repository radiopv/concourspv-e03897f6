import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ContestsList from "@/pages/ContestsList";
import Contest from "@/pages/Contest";
import QuizCompletion from "@/pages/QuizCompletion";
import Points from "@/pages/Points";
import Winners from "@/pages/Winners";
import WinnersList from "@/pages/WinnersList";
import Instructions from "@/pages/Instructions";
import Admin from "@/pages/Admin";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contests" element={<ContestsList />} />
            <Route path="/contests/:contestId" element={<Contest />} />
            <Route path="/quiz-completion" element={<QuizCompletion />} />
            <Route path="/points" element={<Points />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/winners-list" element={<WinnersList />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;