import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page non trouvée</p>
      <Button onClick={() => navigate('/')}>
        Retourner à l'accueil
      </Button>
    </div>
  );
};

export default NotFound;