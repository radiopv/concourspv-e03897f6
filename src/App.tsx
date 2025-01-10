import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavBar from "@/components/navigation/UserNavBar";
import ContestPrizeManager from "@/components/admin/ContestPrizeManager";
import PrizeCatalogManager from "@/components/admin/prize-catalog/PrizeCatalogManager";
import PrizesPage from "@/pages/Prizes"; // Import the new Prizes page

const App = () => {
  return (
    <Router>
      <UserNavBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contests" element={<ContestList />} />
        <Route path="/contests/:contestId" element={<ContestDetail />} />
        <Route path="/admin/prizes" element={<PrizeCatalogManager />} />
        <Route path="/admin/contest-prizes/:contestId" element={<ContestPrizeManager />} />
        <Route path="/prizes" element={<PrizesPage />} /> {/* New route for Prizes page */}
      </Routes>
    </Router>
  );
};

export default App;
