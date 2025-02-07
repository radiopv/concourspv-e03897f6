import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Points from './pages/Points';
import Campeones from './pages/Campeones';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="points" element={<Points />} />
          <Route path="campeones" element={<Campeones />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
