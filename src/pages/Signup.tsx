import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inscription</h1>
      <p className="mb-4">
        Déjà un compte ? {" "}
        <Link to="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default Signup;