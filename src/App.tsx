import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ContestsList from './pages/ContestsList';
import Contest from './pages/Contest';
import QuizCompletion from './pages/QuizCompletion';
import Points from './pages/Points';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contests" element={<ContestsList />} />
          <Route path="contest/:id" element={<Contest />} />
          <Route path="quiz-completion" element={<QuizCompletion />} />
          <Route path="points" element={<Points />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;