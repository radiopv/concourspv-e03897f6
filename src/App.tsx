import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contest from "./pages/Contest";
import ContestsList from "./pages/ContestsList";
import Instructions from "./pages/Instructions";
import Admin from "./pages/Admin";
import QuizCompletion from "./pages/QuizCompletion";
import PrizesPage from "./pages/Prizes";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contest/:id" element={<Contest />} />
          <Route path="contests" element={<ContestsList />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="quiz-completion" element={<QuizCompletion />} />
          <Route path="prizes" element={<PrizesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;