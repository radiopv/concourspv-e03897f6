import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;