import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page non trouvée</p>
      <Link 
        to="/" 
        className="text-primary hover:underline"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;