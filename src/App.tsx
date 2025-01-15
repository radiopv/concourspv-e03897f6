import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Points from "./pages/Points";
import PointsSystem from "./pages/PointsSystem"; // Assuming this is still needed
import OtherPage from "./pages/OtherPage"; // Example for other pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="points" element={<Points />} />
          <Route path="points-system" element={<PointsSystem />} />
          <Route path="other-page" element={<OtherPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
