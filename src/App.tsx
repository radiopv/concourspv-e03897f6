import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ContestsList from './pages/ContestsList';
import Home from './pages/Home'; // Assuming you have a Home component
import About from './pages/About'; // Assuming you have an About component
import NotFound from './pages/NotFound'; // Assuming you have a NotFound component

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/contests" element={<ContestsList />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
