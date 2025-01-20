import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Contest from "./pages/Contest";
import ContestsList from "./pages/ContestsList";
import Dashboard from "./pages/Dashboard";
import Instructions from "./pages/Instructions";
import QuizCompletion from "./pages/QuizCompletion";
import Winners from "./pages/Winners";
import WinnersList from "./pages/WinnersList";
import Prizes from "./pages/Prizes";
import Points from "./pages/Points";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="admin/*" element={<Admin />} />
              <Route path="contest/:id" element={<Contest />} />
              <Route path="contests" element={<ContestsList />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="instructions" element={<Instructions />} />
              <Route path="quiz-completion" element={<QuizCompletion />} />
              <Route path="winners" element={<Winners />} />
              <Route path="winners-list" element={<WinnersList />} />
              <Route path="prizes" element={<Prizes />} />
              <Route path="points" element={<Points />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;