import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionnaireComponent from '@/components/QuestionnaireComponent';

const Contest = () => {
  const params = useParams();
  const navigate = useNavigate();
  const contestId = params.id; // Changement ici : on utilise params.id au lieu de params.contestId

  console.log('Contest component - actual params:', params);
  console.log('Contest component - contestId:', contestId);

  if (!contestId) {
    console.error('No contest ID found in URL parameters');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Erreur</h2>
          <p className="mt-2">ID du concours manquant</p>
          <button 
            onClick={() => navigate('/contests')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour aux concours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionnaireComponent key={contestId} contestId={contestId} />
    </div>
  );
};

export default Contest;