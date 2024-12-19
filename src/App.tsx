import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import RandomDraw from './pages/RandomDraw';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tirage" element={<RandomDraw />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
