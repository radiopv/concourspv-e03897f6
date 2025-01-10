import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavBar from "@/components/navigation/UserNavBar";
import ContestPrizeManager from "@/components/admin/ContestPrizeManager";
import PrizeCatalogManager from "@/components/admin/prize-catalog/PrizeCatalogManager";
import PrizesPage from "@/pages/Prizes";
import { useParams } from 'react-router-dom';

// Composants temporaires pour les routes manquantes
const Home = () => <div className="p-6">Page d'accueil</div>;
const ContestList = () => <div className="p-6">Liste des concours</div>;
const ContestDetail = () => {
  const { contestId } = useParams();
  return <div className="p-6">Détails du concours {contestId}</div>;
};

const App = () => {
  return (
    <Router>
      <UserNavBar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contests" element={<ContestList />} />
        <Route path="/contests/:contestId" element={<ContestDetail />} />
        <Route path="/admin/prizes" element={<PrizeCatalogManager />} />
        <Route 
          path="/admin/contest-prizes/:contestId" 
          element={<ContestPrizeManager contestId={useParams().contestId || ''} />} 
        />
        <Route path="/prizes" element={<PrizesPage />} />
      </Routes>
    </Router>
  );
};

export default App;