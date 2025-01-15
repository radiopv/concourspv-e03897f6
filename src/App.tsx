import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Points from "./pages/Points";
import PointsSystem from "./pages/PointsSystem";
import Contest from "./pages/Contest";
import ContestsList from "./pages/ContestsList";
import ContestStats from "./pages/ContestStats";
import QuizCompletion from "./pages/QuizCompletion";
import Instructions from "./pages/Instructions";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Winners from "./pages/Winners";
import WinnersList from "./pages/WinnersList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="points" element={<Points />} />
          <Route path="points-system" element={<PointsSystem />} />
          <Route path="contests" element={<ContestsList />} />
          <Route path="contest/:id" element={<Contest />} />
          <Route path="contest/:id/stats" element={<ContestStats />} />
          <Route path="quiz-completion" element={<QuizCompletion />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="winners" element={<Winners />} />
          <Route path="winners-list" element={<WinnersList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;