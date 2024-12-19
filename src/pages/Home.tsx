import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bienvenue</h1>
      <div className="space-y-4">
        <p className="text-lg">
          Participez à nos concours et gagnez des prix exceptionnels !
        </p>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </Link>
          <Link 
            to="/signup" 
            className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;