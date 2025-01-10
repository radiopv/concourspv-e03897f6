import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur notre plateforme de concours</h1>
      <p className="text-xl mb-8">
        Participez à nos concours et gagnez des prix exceptionnels !
      </p>
      <Button 
        onClick={() => navigate('/contests')}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        Voir les concours
      </Button>
    </div>
  );
};

export default Home;